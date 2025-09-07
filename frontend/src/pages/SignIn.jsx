import React, { useState } from "react";
import "./SignIn.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { backendUrl } from "../App"; 
import { useGoogleLogin } from '@react-oauth/google';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setMessage("Please fill in all fields.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      localStorage.setItem("email", formData.email);
      const response = await axios.post(
        backendUrl + "/api/auth/login",
        formData
      );

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        setMessage("Login successful! Redirecting...");
        setIsSuccess(true);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user._id);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        setMessage("Login failed. Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred. Please try again later.");
      }
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    window.location.href = "/signup";
  };

  const handleForgotPassword = () => {
    window.location.href = "/forgot-password";
  };

  // Google Sign-in logic using useGoogleLogin hook
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google Login Success:", tokenResponse);
      setMessage("Signing in with Google...");
      setIsLoading(true);
      try {
        // Send the access token to your backend for verification
        const response = await axios.post(backendUrl + "/api/auth/google", {
          token: tokenResponse.access_token,
        });

        if (response.status === 200) {
          console.log("Backend Google Auth Success:", response.data);
          setMessage("Google Sign-in successful! Redirecting...");
          setIsSuccess(true);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("email", response.data.user.email);
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1500);
        } else {
          setMessage("Google Sign-in failed on server. Please try again.");
          setIsSuccess(false);
        }
      } catch (error) {
        console.error("Backend Google Auth Error:", error.response ? error.response.data : error.message);
        setMessage(error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An error occurred during Google Sign-in. Please try again.");
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error("Google Login Error:", errorResponse);
      setMessage("Google Sign-in failed. Please try again.");
      setIsSuccess(false);
      setIsLoading(false);
    },
  });

  return (
    <div className="signin-container">
      <div className="signin-card">
        <p id="signin-heading">Login</p>
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="signin-field-group">
            <div className="signin-field">
              <FontAwesomeIcon icon={faEnvelope} className="signin-input-icon" />
              <input
                type="email"
                className="signin-input-field"
                placeholder="username@domain.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="signin-field signin-password-field">
              <FontAwesomeIcon icon={faLock} className="signin-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="signin-input-field"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="signin-password-toggle-icon"
                onClick={handleTogglePassword}
              />
            </div>
          </div>

          <button
            className="signin-forgot-password-button"
            type="button"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </button>

          {message && (
            <p className={`signin-message ${isSuccess ? "signin-success" : "signin-error"}`}>
              {message}
            </p>
          )}

          <button className="signin-button1" type="submit" disabled={isLoading}>
            {isLoading ? "Logging In..." : "Log In"}
          </button>

          <div className="signin-btn">
            <button className="signin-button2" type="button" onClick={handleSignUp}>
              Don't have an account? Sign Up
            </button>
            {/* Call googleLogin function when this button is clicked */}
            <button
              className="signin-google-signin-button"
              type="button"
              onClick={() => {
                setIsLoading(true); // Set loading state when Google login starts
                googleLogin();
              }}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faGoogle} className="signin-google-icon" />
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
