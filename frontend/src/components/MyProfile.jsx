import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyProfile.css";
import { backendUrl } from "../App";

function MyProfile() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");

  const [cnic, setCnic] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [cnicFrontPic, setCnicFrontPic] = useState(null);
  const [cnicBackPic, setCnicBackPic] = useState(null);

  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [cnicFrontPicPreview, setCnicFrontPicPreview] = useState("");
  const [cnicBackPicPreview, setCnicBackPicPreview] = useState("");

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userEmail = localStorage.getItem("email");

        if (!token || !userEmail) {
          setMessage("Please log in to view and complete your profile.");
          setIsSuccess(false);
          return;
        }

        const response = await axios.get(
          backendUrl + `/api/auth/display?email=${userEmail}`
        );

        if (response.status === 200) {
          const userData = response.data;
          setFname(userData.fname || "");
          setLname(userData.lname || "");
          setEmail(userData.email || "");
          setCnic(userData.cnic || "");

          setDateOfBirth(
            userData.dateOfBirth
              ? new Date(userData.dateOfBirth).toISOString().split("T")[0]
              : ""
          );
          setContactNo(userData.contactNo || "");

          setProfilePicPreview(userData.profilePic || "");
          setCnicFrontPicPreview(userData.cnicFrontPic || "");
          setCnicBackPicPreview(userData.cnicBackPic || "");
          setIsSuccess(true);
        } else {
          setMessage(response.data.message || "Failed to load profile data.");
          setIsSuccess(false);
        }
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response ? error.response.data : error.message
        );
        setMessage(
          error.response?.data?.message || "Error loading profile data."
        );
        setIsSuccess(false);
      }
    };
    fetchUserData();
  }, []);

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFile(null);
      setPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");

    if (!token) {
      setMessage("Authentication token not found. Please log in.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("cnic", cnic);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("contactNo", contactNo);

    if (profilePic) {
      formData.append("profilePic", profilePic);
    } else if (profilePicPreview && profilePicPreview.startsWith("http")) {
      formData.append("profilePic", profilePicPreview);
    }

    if (cnicFrontPic) {
      formData.append("cnicFrontPic", cnicFrontPic);
    } else if (cnicFrontPicPreview && cnicFrontPicPreview.startsWith("http")) {
      formData.append("cnicFrontPic", cnicFrontPicPreview);
    }

    if (cnicBackPic) {
      formData.append("cnicBackPic", cnicBackPic);
    } else if (cnicBackPicPreview && cnicBackPicPreview.startsWith("http")) {
      formData.append("cnicBackPic", cnicBackPicPreview);
    }

    formData.append("email", userEmail);

    try {
      const response = await axios.post(
        backendUrl + "/api/auth/complete-profile",
        formData,
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.status === 200) {
        setMessage(response.data.message || "Profile updated successfully!");
        setIsSuccess(true);
        window.location.href = "/dashboard";
      } else {
        setMessage(
          response.data.message || "Failed to update profile. Please try again."
        );
        setIsSuccess(false);
      }
    } catch (error) {
      console.error(
        "Profile update error:",
        error.response ? error.response.data : error.message
      );
      setMessage(
        error.response?.data?.message ||
          "An error occurred during profile update."
      );
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-completion-page-container">
      <section className="profile-form-section">
        <h2 className="section-title">My Profile</h2>
        <p className="section-subtitle">
          View and update your personal and identification details.
        </p>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Displaying Basic User Info */}
          <div className="form-group">
            <label>First Name:</label>
            <p className="profile-display-text">{fname}</p>
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <p className="profile-display-text">{lname}</p>
          </div>
          <div className="form-group">
            <label>Email:</label>
            <p className="profile-display-text">{email}</p>
          </div>

          {/* CNIC Field */}
          <div className="form-group">
            <label htmlFor="cnic">CNIC Number:</label>
            <div className="input-with-icon">
              <span className="input-icon">💳</span>
              <input
                type="text"
                id="cnic"
                className="form-input"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                placeholder="e.g., 42101-1234567-8"
                required
              />
            </div>
          </div>

          {/* Date of Birth Field */}
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <div className="input-with-icon">
              <span className="input-icon">🎂</span>
              <input
                type="date"
                id="dateOfBirth"
                className="form-input"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Contact Number Field */}
          <div className="form-group">
            <label htmlFor="contactNo">Contact Number:</label>
            <div className="input-with-icon">
              <span className="input-icon">📞</span>
              <input
                type="text"
                id="contactNo"
                className="form-input"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                placeholder="e.g., +923001234567"
                required
              />
            </div>
          </div>

          {/* Profile Picture Upload */}
          <div className="form-group file-upload-group">
            <label htmlFor="profilePic">Profile Picture:</label>
            <input
              type="file"
              id="profilePic"
              className="file-input"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(e, setProfilePic, setProfilePicPreview)
              }
            />
            <label htmlFor="profilePic" className="file-input-label">
              <span className="upload-icon">⬆️</span>
              {profilePic
                ? profilePic.name
                : profilePicPreview
                ? "Change Profile Picture"
                : "Upload Profile Picture"}
            </label>
            {profilePicPreview && (
              <div className="image-preview">
                <img
                  src={profilePicPreview}
                  alt="Profile Preview"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </div>

          {/* CNIC Front Picture Upload */}
          <div className="form-group file-upload-group">
            <label htmlFor="cnicFrontPic">CNIC Front Picture:</label>
            <input
              type="file"
              id="cnicFrontPic"
              className="file-input"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(e, setCnicFrontPic, setCnicFrontPicPreview)
              }
            />
            <label htmlFor="cnicFrontPic" className="file-input-label">
              <span className="upload-icon">⬆️</span>
              {cnicFrontPic
                ? cnicFrontPic.name
                : cnicFrontPicPreview
                ? "Change CNIC Front"
                : "Upload CNIC Front"}
            </label>
            {cnicFrontPicPreview && (
              <div className="image-preview">
                <img
                  src={cnicFrontPicPreview}
                  alt="CNIC Front Preview"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </div>

          {/* CNIC Back Picture Upload */}
          <div className="form-group file-upload-group">
            <label htmlFor="cnicBackPic">CNIC Back Picture:</label>
            <input
              type="file"
              id="cnicBackPic"
              className="file-input"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(e, setCnicBackPic, setCnicBackPicPreview)
              }
            />
            <label htmlFor="cnicBackPic" className="file-input-label">
              <span className="upload-icon">⬆️</span>
              {cnicBackPic
                ? cnicBackPic.name
                : cnicBackPicPreview
                ? "Change CNIC Back"
                : "Upload CNIC Back"}
            </label>
            {cnicBackPicPreview && (
              <div className="image-preview">
                <img
                  src={cnicBackPicPreview}
                  alt="CNIC Back Preview"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </div>

          {message && (
            <p className={`form-message ${isSuccess ? "success" : "error"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            className="submit-profile-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Saving Profile...
              </>
            ) : (
              "Save Profile"
            )}
          </button>
        </form>
      </section>
    </div>
  );
}

export default MyProfile;
