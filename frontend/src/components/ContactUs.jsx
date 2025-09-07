import React, { useState, useEffect } from "react";
import "./ContactUs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faTag,
  faMessage,
  faPhoneAlt,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { backendUrl } from "../App";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles changes to any input field in the form and updates the formData state.
   * @param {Object} e - The event object from the input change.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Handles the form submission for the contact form.
   * Performs basic client-side validation and simulates an API call.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMessage("");
    setIsLoading(true);
    setIsSuccess(false);

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setFeedbackMessage("Please fill in all fields.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setFeedbackMessage("Please enter a valid email address.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/contact`, formData);

      if (response.status === 200) {
        setFeedbackMessage("Your message has been sent successfully!");
        setIsSuccess(true);

        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setFeedbackMessage("Failed to send your message. Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Contact form submission error:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setFeedbackMessage(error.response.data.message);
      } else {
        setFeedbackMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (feedbackMessage) {
      timer = setTimeout(() => {
        setFeedbackMessage("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [feedbackMessage]);

  return (
    <div className="contactus-container">
      <div className="contactus-card">
        <form className="contactus-form" onSubmit={handleSubmit}>
          <p id="contactus-heading">Contact Us</p>
          <p className="contactus-subheading">
            We'd love to hear from you! Please fill out the form below or reach
            out to us directly.
          </p>

          {/* Name Field */}
          <div className="contactus-field">
            <FontAwesomeIcon icon={faUser} className="contactus-input-icon" />
            <input
              type="text"
              className="contactus-input-field"
              placeholder="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="contactus-field">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="contactus-input-icon"
            />
            <input
              type="email"
              className="contactus-input-field"
              placeholder="Your Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          {/* Subject Field */}
          <div className="contactus-field">
            <FontAwesomeIcon icon={faTag} className="contactus-input-icon" />
            <input
              type="text"
              className="contactus-input-field"
              placeholder="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          {/* Message Field */}
          <div className="contactus-field textarea">
            <FontAwesomeIcon
              icon={faMessage}
              className="contactus-input-icon"
            />
            <textarea
              className="contactus-textarea-field"
              placeholder="Your Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
          </div>

          {/* Feedback Message Display */}
          {feedbackMessage && (
            <p
              className={`contactus-message ${isSuccess ? "success" : "error"}`}
            >
              {feedbackMessage}
            </p>
          )}

          {/* Submit Button */}
          <div className="contactus-btn">
            <button
              className="contactus-button1"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Sending Message..." : "Send Message"}
            </button>
          </div>

          {/* Optional: Direct Contact Info Section */}
          <div
            style={{
              textAlign: "center",
              marginTop: "2rem",
              color: "#4f46e5",
              fontSize: "0.95rem",
            }}
          >
            <p style={{ marginBottom: "0.5rem" }}>Or reach us directly:</p>
            <p style={{ marginBottom: "0.25rem" }}>
              <FontAwesomeIcon
                icon={faEnvelope}
                style={{ marginRight: "0.5rem" }}
              />
              <a
                href="mailto:support@example.com"
                style={{ color: "#4f46e5", textDecoration: "none" }}
              >
                info@edusphere.com
              </a>
            </p>
            <p style={{ marginBottom: "0.25rem" }}>
              <FontAwesomeIcon
                icon={faPhoneAlt}
                style={{ marginRight: "0.5rem" }}
              />
              <a
                href="tel:+923456789012"
                style={{ color: "#4f46e5", textDecoration: "none" }}
              >
                +92 345 6789012
              </a>
            </p>
            <p>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                style={{ marginRight: "0.5rem" }}
              />
              123 Learning Lane, Knowledge City, World
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
