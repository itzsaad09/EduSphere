import mongoose from "mongoose";

const registrationSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, 
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    verificationCodeExpiresAt: Date,
    
    cnic: {
      type: String,
      unique: true,
      
    },
    dateOfBirth: {
      type: Date,
    },
    contactNo: {
      type: String,
    },
    profilePic: {
      type: String, 
    },
    cnicFrontPic: {
      type: String, 
    },
    cnicBackPic: {
      type: String, 
    },
    
  },
  { timestamps: true } 
);

const registrationModel = mongoose.model("Registration", registrationSchema);
export default registrationModel;
