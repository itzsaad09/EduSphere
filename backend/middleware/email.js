import transporter from "./emailConfig.js";
import { emailTemplate, welcomeEmailTemplate } from "./emailTemplate.js";

/**
 * Sends a verification code email to a user.
 * @param {string} fname - User's first name.
 * @param {string} lname - User's last name.
 * @param {string} email - User's email address.
 * @param {string} subject - The subject line for the email.
 * @param {string} verificationCode - The OTP code to be sent.
 * @param {Date} verificationCodeExpiresAt - The expiration time of the OTP.
 */
const sendVerificationCode = async (
  fname,
  lname,
  email,
  subject,
  verificationCode,
  verificationCodeExpiresAt
) => {
  const mailOptions = {
    from: '"EduSphere" <info.mail.sender23@gmail.com>',
    to: email,
    subject: subject,
    html: emailTemplate
      .replace("[User Name]", `${fname} ${lname}`)
      .replace("[OTP_CODE]", verificationCode)
      .replace(
        "[OTP_VALIDITY_MINUTES]",
        Math.floor((verificationCodeExpiresAt - Date.now()) / 60000)
      )
      .replace("[CURRENT_YEAR]", new Date().getFullYear())
      .replace("[YOUR_WEBSITE_URL]", "http://localhost:5173/")
      .replace("[PRIVACY_POLICY_URL]", "http://localhost:5173/privacy-policy")
      .replace("[TERMS_OF_SERVICE_URL]", "http://localhost:5173/terms-of-service"),
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.response);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

/**
 * Sends a welcome email to a user after successful verification.
 * @param {string} fname - User's first name.
 * @param {string} lname - User's last name.
 * @param {string} email - User's email address.
 */
const sendWelcomeEmail = async (fname, lname, email) => {
  const mailOptions = {
    from: '"EduSphere" <info.mail.sender23@gmail.com>',
    to: email,
    // Enhanced subject line to convey importance and excitement
    subject: `🚀 Welcome to EduSphere, ${fname}! Your Learning Journey Begins!`,
    html: welcomeEmailTemplate
      .replace("[User Name]", `${fname} ${lname}`)
      .replace("[CURRENT_YEAR]", new Date().getFullYear())
      .replace("[EXPLORE_COURSES_URL]", "https://www.edusphere.com/courses")
      .replace("[YOUR_WEBSITE_URL]", "http://localhost:5173/")
      .replace("[PRIVACY_POLICY_URL]", "http://localhost:5173/privacy-policy")
      .replace("[TERMS_OF_SERVICE_URL]", "http://localhost:5173/terms-of-service"),
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:", info.response);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export { sendVerificationCode, sendWelcomeEmail };
