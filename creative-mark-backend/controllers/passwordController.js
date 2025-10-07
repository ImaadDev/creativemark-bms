import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendEmail } from "../utils/mailer.js";

/**
 * @desc   Handle forgot password request
 * @route  POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // 2️⃣ Check if user exists (normalize email)
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Send same message to avoid email enumeration
      return res
        .status(200)
        .json({ message: "If that email exists, a reset link has been sent." });
    }

    // 3️⃣ Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // 4️⃣ Save hashed token and expiration in DB
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // 5️⃣ Create reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(
      normalizedEmail
    )}`;

    // 6️⃣ Prepare professional email content
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - CreativeMark</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8f9fa;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #242021 0%, #2a2422 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23ffd17a" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
                opacity: 0.1;
            }
            
            .logo {
                position: relative;
                z-index: 1;
                width: 60px;
                height: 60px;
                background-color: rgba(255, 209, 122, 0.2);
                border-radius: 16px;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: bold;
                color: #ffd17a;
            }
            
            .header h1 {
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
                position: relative;
                z-index: 1;
            }
            
            .header p {
                color: #ffd17a;
                font-size: 16px;
                position: relative;
                z-index: 1;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .greeting {
                font-size: 18px;
                color: #242021;
                margin-bottom: 20px;
                font-weight: 600;
            }
            
            .message {
                font-size: 16px;
                color: #555;
                margin-bottom: 30px;
                line-height: 1.7;
            }
            
            .reset-button {
                display: inline-block;
                background: linear-gradient(135deg, #242021 0%, #2a2422 100%);
                color: #ffffff;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                margin: 20px 0;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(36, 32, 33, 0.3);
            }
            
            .reset-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(36, 32, 33, 0.4);
            }
            
            .security-info {
                background-color: #f8f9fa;
                border-left: 4px solid #ffd17a;
                padding: 20px;
                margin: 30px 0;
                border-radius: 0 8px 8px 0;
            }
            
            .security-info h3 {
                color: #242021;
                font-size: 16px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
            }
            
            .security-info h3::before {
                content: '🔒';
                margin-right: 8px;
            }
            
            .security-info ul {
                list-style: none;
                padding-left: 0;
            }
            
            .security-info li {
                color: #666;
                margin-bottom: 8px;
                padding-left: 20px;
                position: relative;
            }
            
            .security-info li::before {
                content: '✓';
                color: #ffd17a;
                font-weight: bold;
                position: absolute;
                left: 0;
            }
            
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 20px;
                margin: 30px 0;
            }
            
            .warning h3 {
                color: #856404;
                font-size: 16px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
            }
            
            .warning h3::before {
                content: '⚠️';
                margin-right: 8px;
            }
            
            .warning p {
                color: #856404;
                font-size: 14px;
                margin: 0;
            }
            
            .footer {
                background-color: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
            
            .footer p {
                color: #666;
                font-size: 14px;
                margin-bottom: 10px;
            }
            
            .footer .company-info {
                color: #242021;
                font-weight: 600;
                margin-top: 15px;
            }
            
            .social-links {
                margin-top: 20px;
            }
            
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #242021;
                text-decoration: none;
                font-size: 14px;
            }
            
            .social-links a:hover {
                color: #ffd17a;
            }
            
            @media (max-width: 600px) {
                .email-container {
                    margin: 0;
                    border-radius: 0;
                }
                
                .header, .content, .footer {
                    padding: 20px;
                }
                
                .header h1 {
                    font-size: 24px;
                }
                
                .reset-button {
                    display: block;
                    width: 100%;
                    text-align: center;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <div class="logo">CM</div>
                <h1>Password Reset Request</h1>
                <p>CreativeMark Business Management System</p>
            </div>
            
            <!-- Content -->
            <div class="content">
                <div class="greeting">Hello ${user.fullName || 'Valued Client'},</div>
                
                <div class="message">
                    We received a request to reset your password for your CreativeMark account. If you made this request, click the button below to reset your password.
                </div>
                
                <div style="text-align: center;">
                    <a href="${resetLink}" class="reset-button">Reset My Password</a>
                </div>
                
                <div class="security-info">
                    <h3>Security Information</h3>
                    <ul>
                        <li>This link will expire in 1 hour for your security</li>
                        <li>You can only use this link once</li>
                        <li>If you didn't request this, please ignore this email</li>
                        <li>Your password will remain unchanged until you click the link</li>
                    </ul>
                </div>
                
                <div class="warning">
                    <h3>Important Security Notice</h3>
                    <p>If you didn't request a password reset, please ignore this email. Your account remains secure and no changes have been made.</p>
                </div>
                
                <div class="message">
                    <strong>Having trouble with the button?</strong><br>
                    Copy and paste this link into your browser:<br>
                    <a href="${resetLink}" style="color: #242021; word-break: break-all;">${resetLink}</a>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p>This email was sent from CreativeMark Business Management System</p>
                <p>If you have any questions, please contact our support team</p>
                
                <div class="social-links">
                    <a href="#">Website</a>
                    <a href="#">Support</a>
                    <a href="#">Privacy Policy</a>
                </div>
                
                <div class="company-info">
                    © 2024 CreativeMark. All rights reserved.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    // 7️⃣ Send email
    await sendEmail(user.email, "🔐 Password Reset Request - CreativeMark", html);

    return res
      .status(200)
      .json({ message: "If that email exists, a reset link has been sent." });
  } catch (error) {
    console.error("❌ Forgot password error:", error.message);
    return res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

/**
 * @desc   Handle password reset
 * @route  POST /api/auth/reset-password
 * @access Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    // 1️⃣ Validate input
    if (!token || !email || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 2️⃣ Hash the token to match stored value
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 3️⃣ Find user with valid token (normalize email)
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({
      email: normalizedEmail,
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    // 4️⃣ Set new password (let the pre-save hook handle hashing)
    user.passwordHash = newPassword;

    // 5️⃣ Clear reset fields
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // Send confirmation email
    const confirmationHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Successful - CreativeMark</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8f9fa;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
            
            .logo {
                width: 60px;
                height: 60px;
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 16px;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: bold;
                color: #ffffff;
            }
            
            .header h1 {
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
            }
            
            .header p {
                color: rgba(255, 255, 255, 0.9);
                font-size: 16px;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .greeting {
                font-size: 18px;
                color: #242021;
                margin-bottom: 20px;
                font-weight: 600;
            }
            
            .message {
                font-size: 16px;
                color: #555;
                margin-bottom: 30px;
                line-height: 1.7;
            }
            
            .success-info {
                background-color: #d4edda;
                border: 1px solid #c3e6cb;
                border-radius: 8px;
                padding: 20px;
                margin: 30px 0;
            }
            
            .success-info h3 {
                color: #155724;
                font-size: 16px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
            }
            
            .success-info h3::before {
                content: '✅';
                margin-right: 8px;
            }
            
            .success-info p {
                color: #155724;
                font-size: 14px;
                margin: 0;
            }
            
            .security-tips {
                background-color: #f8f9fa;
                border-left: 4px solid #ffd17a;
                padding: 20px;
                margin: 30px 0;
                border-radius: 0 8px 8px 0;
            }
            
            .security-tips h3 {
                color: #242021;
                font-size: 16px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
            }
            
            .security-tips h3::before {
                content: '🛡️';
                margin-right: 8px;
            }
            
            .security-tips ul {
                list-style: none;
                padding-left: 0;
            }
            
            .security-tips li {
                color: #666;
                margin-bottom: 8px;
                padding-left: 20px;
                position: relative;
            }
            
            .security-tips li::before {
                content: '•';
                color: #ffd17a;
                font-weight: bold;
                position: absolute;
                left: 0;
            }
            
            .footer {
                background-color: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
            
            .footer p {
                color: #666;
                font-size: 14px;
                margin-bottom: 10px;
            }
            
            .footer .company-info {
                color: #242021;
                font-weight: 600;
                margin-top: 15px;
            }
            
            @media (max-width: 600px) {
                .email-container {
                    margin: 0;
                    border-radius: 0;
                }
                
                .header, .content, .footer {
                    padding: 20px;
                }
                
                .header h1 {
                    font-size: 24px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <div class="logo">CM</div>
                <h1>Password Reset Successful</h1>
                <p>CreativeMark Business Management System</p>
            </div>
            
            <!-- Content -->
            <div class="content">
                <div class="greeting">Hello ${user.fullName || 'Valued Client'},</div>
                
                <div class="message">
                    Your password has been successfully reset. You can now log in to your CreativeMark account using your new password.
                </div>
                
                <div class="success-info">
                    <h3>Password Reset Confirmed</h3>
                    <p>Your account password was changed on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}. If you did not make this change, please contact our support team immediately.</p>
                </div>
                
                <div class="security-tips">
                    <h3>Security Tips</h3>
                    <ul>
                        <li>Use a strong, unique password</li>
                        <li>Don't share your password with anyone</li>
                        <li>Log out from shared devices</li>
                        <li>Enable two-factor authentication if available</li>
                    </ul>
                </div>
                
                <div class="message">
                    <strong>Need help?</strong><br>
                    If you have any questions or concerns, please don't hesitate to contact our support team.
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p>This email was sent from CreativeMark Business Management System</p>
                <p>If you have any questions, please contact our support team</p>
                
                <div class="company-info">
                    © 2024 CreativeMark. All rights reserved.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    // Send confirmation email
    try {
        await sendEmail(user.email, "✅ Password Reset Successful - CreativeMark", confirmationHtml);
    } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the password reset if email fails
    }

    return res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("❌ Reset password error:", error.message);
    return res.status(500).json({ message: "Unable to reset password. Try again later." });
  }
};
