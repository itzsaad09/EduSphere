import registrationModel from "../models/registrationModel.js";
import validator from "validator"; // Already imported, used for email and strong password
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationCode, sendWelcomeEmail } from "../middleware/email.js";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

// Create Token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

// Controller Functions for Admin Management
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASS
    ) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(email + password, process.env.JWT_SECRET);
    res.status(200).json({ token: token, message: "Login Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller Function for Registration
const register = async (req, res) => {
  try {
    const { fname, lname, email, password, confirmPassword } = req.body;

    if (!fname || !lname || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    } else if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    } else if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Password is not strong enough" });
    } else if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await registrationModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    } // Hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verificationCodeExpiresAt = new Date();
    verificationCodeExpiresAt.setMinutes(
      verificationCodeExpiresAt.getMinutes() + 3
    );

    const newUser = new registrationModel({
      fname,
      lname,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiresAt,
      isVerified: false,
      // New profile fields are intentionally left blank here
      // They will be added after login, in a separate step
    });

    const user = await newUser.save();

    const subject = "Please verify your email address.";
    await sendVerificationCode(
      fname,
      lname,
      email,
      subject,
      verificationCode,
      verificationCodeExpiresAt
    );

    // IMPORTANT CHANGE HERE: Do NOT create a login token immediately after registration.
    // User needs to verify email first.
    res.status(201).json({
      userId: user._id, // Provide userId for potential redirection to verification
      email: user.email,
      message:
        "Registration successful. Please check your email for the verification code.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to verify the code
const verify = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // Find user by email
    const user = await registrationModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the provided code matches the one in the database
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    // Check if the verification code has expired
    if (new Date() > user.verificationCodeExpiresAt) {
      // If expired, remove the code and expiration time from the user document
      user.verificationCode = null;
      user.verificationCodeExpiresAt = null;
      await user.save();
      return res.status(400).json({
        message: "Verification code has expired. Please request a new one.",
      });
    }

    // If code is valid and not expired, mark user as verified
    const isFirstVerification = !user.isVerified; // Store current state before updating

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiresAt = null;
    await user.save();

    // Send a welcome email ONLY if it's the first time verification
    if (isFirstVerification) {
      await sendWelcomeEmail(user.fname, user.lname, user.email);
    }

    // Create a login token after successful verification
    const token = createToken(user._id);

    // After verification, user will still need to log in to get profile completion check
    res.status(200).json({
      token,
      userId: user._id, // Include userId in response
      message:
        "Account successfully verified! Please log in to complete your profile.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to resend the verification code
const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await registrationModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpiresAt = new Date();
    verificationCodeExpiresAt.setMinutes(
      verificationCodeExpiresAt.getMinutes() + 3
    );
    user.verificationCode = verificationCode;
    user.verificationCodeExpiresAt = verificationCodeExpiresAt;
    await user.save();
    const subject = "Please verify your email address.";
    await sendVerificationCode(
      user.fname,
      user.lname,
      user.email,
      subject,
      verificationCode,
      verificationCodeExpiresAt
    );
    res.status(200).json({ message: "Verification code sent successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await registrationModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email address first." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = createToken(user._id);

    // Determine if profile is complete
    const isProfileComplete =
      !!user.cnic &&
      !!user.dateOfBirth &&
      !!user.contactNo &&
      !!user.profilePic &&
      !!user.cnicFrontPic &&
      !!user.cnicBackPic;

    res.status(200).json({
      token,
      message: "Login successful.",
      isProfileComplete, // Indicate profile completion status
      user: {
        _id: user._id, // Include user ID in the response for frontend redirection
        email: user.email,
        fname: user.fname,
        lname: user.lname,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to Recover Password
const recoverPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const user = await registrationModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();
    const token = createToken(user._id);

    res.status(200).json({ token, message: "Password recovery successful." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to Get User Data
const getUser = async (req, res) => {
  try {
    // This assumes the user ID is available from an authentication middleware (e.g., req.user._id)
    // or passed securely. Using email from query for now, but sensitive for authenticated routes.
    const { email } = req.query;
    const user = await registrationModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Only return relevant, non-sensitive public user data
    const userData = {
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      isVerified: user.isVerified,
      cnic: user.cnic,
      dateOfBirth: user.dateOfBirth,
      contactNo: user.contactNo,
      profilePic: user.profilePic,
      cnicFrontPic: user.cnicFrontPic,
      cnicBackPic: user.cnicBackPic,
      createdAt: user.createdAt,
    };
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to show all users for admin
const getAllUsers = async (req, res) => {
  try {
    const users = await registrationModel.find({ isVerified: true });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to complete user profile after login
const completeProfile = async (req, res) => {
  try {
    // IMPORTANT: As discussed, if you are not using a token in the header
    // to identify the user, you must pass the user's email (or userId)
    // in the request body. This is less secure.
    const { email, cnic, dateOfBirth, contactNo } = req.body;

    if (!email) {
      return res.status(400).json({ message: "User email is required." });
    }

    const user = await registrationModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // --- Validation for profile fields ---
    if (!cnic || !/^\d{5}-\d{7}-\d{1}$/.test(cnic)) {
      return res
        .status(400)
        .json({
          message:
            "CNIC is required and must be in the format XXXXX-XXXXXXX-X.",
        });
    }

    if (!dateOfBirth || isNaN(new Date(dateOfBirth))) {
      return res
        .status(400)
        .json({ message: "Valid Date of Birth is required." });
    }
    const dob = new Date(dateOfBirth);
    if (dob > new Date()) {
      return res
        .status(400)
        .json({ message: "Date of Birth cannot be in the future." });
    }
    // Optional: Check for minimum age, e.g., 18 years
    const minAgeDate = new Date();
    minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
    if (dob > minAgeDate) {
      return res
        .status(400)
        .json({ message: "User must be at least 18 years old." });
    }

    if (!contactNo || !/^(\+92)?[0-9]{3}[0-9]{7}$/.test(contactNo)) {
      return res
        .status(400)
        .json({
          message:
            "Contact Number is required and must include country code (e.g., +923001234567).",
        });
    }
    // --- End Validation ---

    // Initialize image URLs with existing values or null
    let profilePicUrl = user.profilePic;
    let cnicFrontPicUrl = user.cnicFrontPic;
    let cnicBackPicUrl = user.cnicBackPic;

    const defaultImageUrl =
      "https://res.cloudinary.com/dop0d5y5g/image/upload/v1690000000/no-image-available-icon-6_sx4q0n.png";

    // Handle profile picture upload
    if (req.files && req.files.profilePic && req.files.profilePic.length > 0) {
      const result = await cloudinary.uploader.upload(
        req.files.profilePic[0].path,
        {
          resource_type: "image",
        }
      );
      profilePicUrl = result.secure_url;
    } else if (!user.profilePic) {
      // If no new file and no existing profile pic, set to default
      profilePicUrl = defaultImageUrl;
    }

    // Handle CNIC front picture upload
    if (
      req.files &&
      req.files.cnicFrontPic &&
      req.files.cnicFrontPic.length > 0
    ) {
      const result = await cloudinary.uploader.upload(
        req.files.cnicFrontPic[0].path,
        {
          resource_type: "image",
        }
      );
      cnicFrontPicUrl = result.secure_url;
    } else if (!user.cnicFrontPic) {
      // If no new file and no existing CNIC front pic, set to default
      cnicFrontPicUrl = defaultImageUrl;
    }

    // Handle CNIC back picture upload
    if (
      req.files &&
      req.files.cnicBackPic &&
      req.files.cnicBackPic.length > 0
    ) {
      const result = await cloudinary.uploader.upload(
        req.files.cnicBackPic[0].path,
        {
          resource_type: "image",
        }
      );
      cnicBackPicUrl = result.secure_url;
    } else if (!user.cnicBackPic) {
      // If no new file and no existing CNIC back pic, set to default
      cnicBackPicUrl = defaultImageUrl;
    }

    // Update the profile fields
    user.cnic = cnic; // CNIC must be provided due to validation
    user.dateOfBirth = dateOfBirth; // DOB must be provided
    user.contactNo = contactNo; // ContactNo must be provided
    user.profilePic = profilePicUrl;
    user.cnicFrontPic = cnicFrontPicUrl;
    user.cnicBackPic = cnicBackPicUrl;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully!",
      user: { _id: user._id, email: user.email, isProfileComplete: true },
    });
  } catch (error) {
    console.error("Profile Completion Error:", error.message);
    res
      .status(500)
      .json({ message: "Failed to complete profile. Please try again." });
  }
};

// Controller Function for Google Authentication
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body; // Google access_token from frontend

    if (!token) {
      return res
        .status(400)
        .json({ message: "Google access token is required." });
    }

    // 1. Verify the Google access token with Google's API
    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
    );
    const googleProfile = googleResponse.data;

    const { email, given_name, family_name, sub: googleId } = googleProfile; // 'sub' is Google's unique user ID

    // 2. Check if a user with this email already exists in your database
    let user = await registrationModel.findOne({ email });

    if (user) {
      // If user exists, update their Google ID if not already set (optional)
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
      // Log them in
      const appToken = createToken(user._id);
      return res.status(200).json({
        user: {
          email: user.email,
          fname: user.fname,
          lname: user.lname,
          isVerified: user.isVerified,
        },
        token: appToken,
        message: "Google login successful.",
      });
    } else {
      // If user does not exist, register them
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); // Example: random 16-char string
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatedPassword, salt);

      const newUser = new registrationModel({
        fname: given_name || "GoogleUser", // Use Google's first name, or a default
        lname: family_name || "", // Use Google's last name
        email: email,
        password: hashedPassword, // Store a generated password
        googleId: googleId, // Store Google's unique ID
        isVerified: true, // Mark as verified since Google handles email verification
      });

      user = await newUser.save();

      // Send a welcome email for newly registered Google users
      await sendWelcomeEmail(user.fname, user.lname, user.email);

      const appToken = createToken(user._id);
      return res.status(200).json({
        user: {
          email: user.email,
          fname: user.fname,
          lname: user.lname,
          isVerified: user.isVerified,
        },
        token: appToken,
        message: "Google registration successful.",
      });
    }
  } catch (error) {
    console.error(
      "Google Auth Error:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ message: "Google authentication failed. Please try again." });
  }
};

export {
  adminLogin,
  register,
  verify,
  resendVerificationCode,
  login,
  recoverPassword,
  getUser,
  getAllUsers,
  googleAuth,
  completeProfile, // Export the new function
};
