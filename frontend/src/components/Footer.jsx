import React from 'react';
import './Footer.css'; // Assuming your footer specific CSS is here
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Importing solid icons for contact details
import { faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons"; // Added faMapMarkerAlt
// Importing brand icons for social media
import { faFacebookF, faTwitter, faLinkedinIn, faInstagram } from "@fortawesome/free-brands-svg-icons"; // Corrected imports to match component usage

// Enhanced Footer Component for the EduSphere website
function Footer() {
  return (
    <footer className="footer-main">
      <div className="footer-container">
        {/* About EduSphere Section */}
        <div className="footer-section footer-about">
          <h3 className="footer-heading">EduSphere</h3>
          <p className="footer-description">
            Your gateway to comprehensive learning and skill development. Empowering futures, one course at a time.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section footer-links-group">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-list">
            <li><a href="/" className="footer-link">Home</a></li>
            <li><a href="/courses" className="footer-link">Courses</a></li>
            <li><a href="#" className="footer-link">About Us</a></li>
            <li><a href="#" className="footer-link">Testimonials</a></li> {/* Linked to Feedback page */}
            <li><a href="#" className="footer-link">Blog</a></li>
          </ul>
        </div>

        {/* Get In Touch Section */}
        <div className="footer-section footer-contact">
          <h3 className="footer-heading">Get In Touch</h3>
          <ul className="footer-list footer-contact-list">
            <li>
              {/* Using FontAwesomeIcon component for location */}
              <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" /> 123 Learning Lane, Knowledge City, World
            </li>
            <li>
              {/* Using FontAwesomeIcon component for email */}
              <FontAwesomeIcon icon={faEnvelope} className="contact-icon" /> <a href="mailto:info@edusphere.com" className="footer-link">info@edusphere.com</a>
            </li>
            <li>
              {/* Using FontAwesomeIcon component for phone */}
              <FontAwesomeIcon icon={faPhone} className="contact-icon" /> <a href="tel:+923456789012" className="footer-link">+92 345 6789012</a>
            </li>
          </ul>
          {/* Social Media Icons (using Font Awesome React components) */}
          <div className="social-icons">
            <a href="https://facebook.com" className="social-icon" aria-label="Facebook" target="_blank"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="https://twitter.com" className="social-icon" aria-label="Twitter" target="_blank"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="https://www.linkedin.com" className="social-icon" aria-label="LinkedIn" target="_blank"><FontAwesomeIcon icon={faLinkedinIn} /></a>
            <a href="https://instagram.com" className="social-icon" aria-label="Instagram" target="_blank"><FontAwesomeIcon icon={faInstagram} /></a>
          </div>
        </div>

        {/* Legal Links (Bottom Section) */}
        <div className="footer-bottom">
          <p className="footer-copyright">&copy; {new Date().getFullYear()} EduSphere. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
            <a href="/terms-of-service" className="footer-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
