/**
 * @fileoverview This module exports HTML strings for various EduSphere email templates,
 * tailored for different purposes (OTP, Welcome) and consistent branding.
 *
 * These strings are designed to be used in a Node.js or similar backend environment
 * where placeholders (e.g., [USER_NAME], [OTP_CODE]) can be replaced with dynamic data before sending.
 */

// --- OTP Verification Email Template ---
export const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your EduSphere One-Time Password</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif; /* Use Inter font */
            margin: 0;
            padding: 0;
            background-color: #f3f4f6; /* Light gray from EduSphere scheme */
            color: #374151; /* Dark gray text */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            line-height: 1.6;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.08); /* Softer shadow */
            border-top: 4px solid #1d4ed8; /* Primary blue from EduSphere scheme */
            overflow: hidden;
        }
        .header {
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid #e5e7eb; /* Lighter gray border */
        }
        .header h1 {
            margin: 0;
            color: #1e40af; /* Darker blue heading */
            font-size: 26px; /* Slightly larger */
            font-weight: 800; /* Stronger weight */
        }
        .content {
            padding: 30px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 15px; /* Consistent spacing */
        }
        .otp-code {
            font-size: 36px; /* Slightly adjusted size */
            font-weight: bold;
            color: #f97316; /* Orange for emphasis */
            margin: 25px 0;
            padding: 15px 30px;
            background-color: #fff7ed; /* Very light orange background */
            border-radius: 8px;
            display: inline-block;
            letter-spacing: 5px;
            border: 1px dashed #f97316; /* Dashed orange border */
        }
        .warning {
            color: #dc2626; /* Standard red for warnings */
            font-weight: bold;
            margin-top: 20px;
            font-size: 15px; /* Consistent with other text */
        }
        .footer {
            background-color: #1d4ed8; /* Darker blue from EduSphere footer */
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #e0f2f7; /* Light text for footer */
            border-top: 1px solid rgba(255, 255, 255, 0.1); /* Subtle separator */
        }
        .footer p {
            margin: 5px 0;
        }
        .footer a {
            color: #93c5fd; /* Lighter blue for footer links */
            text-decoration: none;
            transition: color 0.3s ease;
        }
        .footer a:hover {
            color: #ffffff;
        }
        @media only screen and (max-width: 600px) {
            .email-container {
                border-radius: 0;
                margin: 0;
            }
            .header, .content, .footer {
                padding: 20px; /* Reduced padding on small screens */
            }
            .header h1 {
                font-size: 22px;
            }
            .content p {
                font-size: 15px;
            }
            .otp-code {
                font-size: 30px;
                padding: 12px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>EduSphere</h1>
        </div>
        <div class="content">
            <p>Hello [User Name],</p>
            <p>You recently requested a One-Time Password (OTP) for your EduSphere account.</p>
            <p>Please use the following OTP to complete your action:</p>
            <div class="otp-code">[OTP_CODE]</div>
            <p>This OTP is valid for [OTP_VALIDITY_MINUTES] minutes.</p>
            <p class="warning"><strong>Do not share this code with anyone.</strong></p>
            <p>If you did not request this OTP, please ignore this email or contact our support team immediately.</p>
        </div>
        <div class="footer">
            <p>&copy; [CURRENT_YEAR] EduSphere. All rights reserved.</p>
            <p>
                <a href="[YOUR_WEBSITE_URL]">Visit our website</a> |
                <a href="[PRIVACY_POLICY_URL]">Privacy Policy</a> |
                <a href="[TERMS_OF_SERVICE_URL]">Terms of Service</a>
            </p>
        </div>
    </div>
</body>
</html>
`;

// --- Welcome Email Template ---
export const welcomeEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to EduSphere!</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif; /* Use Inter font */
            margin: 0;
            padding: 0;
            background-color: #f3f4f6; /* Light gray from EduSphere scheme */
            color: #374151; /* Dark gray text */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            line-height: 1.6;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.08);
            border-top: 4px solid #f97316; /* Accent orange for welcome email */
            overflow: hidden;
        }
        .header {
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid #e5e7eb; /* Lighter gray border */
        }
        .header h1 {
            margin: 0;
            color: #1e40af; /* Darker blue heading */
            font-size: 26px;
            font-weight: 800;
        }
        .content {
            padding: 30px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        .highlight-text {
            color: #1d4ed8; /* Primary blue for highlighting key phrases */
            font-weight: bold;
        }
        .action-button { /* Renamed from .button to .action-button for consistency */
            display: inline-block;
            padding: 12px 25px;
            background-color: #1d4ed8; /* Primary blue button */
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            font-size: 17px;
            margin: 20px 0; /* Adjusted margin */
            transition: background-color 0.3s ease;
        }
        .action-button:hover {
            background-color: #1e40af; /* Darker blue on hover */
        }
        .footer {
            background-color: #1d4ed8; /* Darker blue from EduSphere footer */
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #e0f2f7; /* Light text for footer */
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer p {
            margin: 5px 0;
        }
        .footer a {
            color: #93c5fd; /* Lighter blue for footer links */
            text-decoration: none;
            transition: color 0.3s ease;
        }
        .footer a:hover {
            color: #ffffff;
        }
        @media only screen and (max-width: 600px) {
            .email-container {
                border-radius: 0;
                margin: 0;
            }
            .header, .content, .footer {
                padding: 20px; /* Reduced padding on small screens */
            }
            .header h1 {
                font-size: 22px;
            }
            .content p {
                font-size: 15px;
            }
            .action-button {
                padding: 10px 20px;
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>EduSphere</h1>
        </div>
        <div class="content">
            <p>Hello [User Name],</p>
            <p>Congratulations! Your account with <span class="highlight-text">EduSphere</span> has been successfully verified.</p>
            <p>We're excited to have you on board. You can now log in and start exploring our wide range of courses.</p>
            <a href="[EXPLORE_COURSES_URL]" class="action-button">Explore Courses</a>
            <p style="margin-top: 25px;">If you have any questions or need assistance, please do not hesitate to contact our support team.</p>
            <p>Best regards,<br/>The EduSphere Team</p>
        </div>
        <div class="footer">
            <p>&copy; [CURRENT_YEAR] EduSphere. All rights reserved.</p>
            <p>
                <a href="[YOUR_WEBSITE_URL]">Visit our website</a> |
                <a href="[PRIVACY_POLICY_URL]">Privacy Policy</a> |
                <a href="[TERMS_OF_SERVICE_URL]">Terms of Service</a>
            </p>
        </div>
    </div>
</body>
</html>
`;
