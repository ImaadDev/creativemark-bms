import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {sendEmail} from '../utils/mailer.js'

/**
 * Generate JWT Token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || "supersecretkey",
    { expiresIn: "7d" }
  );
};

/**
 * @desc    Register a new Client (public)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      phoneCountryCode,
      nationality,
      residencyStatus,
      password,
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // 1️⃣ Generate verification token
    const verificationToken = jwt.sign(
      { email: normalizedEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 2️⃣ Create unverified user
    const user = new User({
      fullName,
      email: normalizedEmail,
      phone,
      phoneCountryCode: phoneCountryCode || "+966",
      nationality,
      residencyStatus,
      passwordHash: password,
      role: "client",
      isVerified: false,
      verificationToken,
      verificationTokenExpires: Date.now() + 3600000, // 1 hour
    });

    await user.save();

    // 3️⃣ Send verification email
    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    await sendEmail(
      normalizedEmail,
      `🎉 Welcome to ${process.env.BRAND_NAME} - Verify Your Email`,
      `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
          <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);">
            
            <!-- Header with Brand Colors -->
            <div style="background: linear-gradient(135deg, #242021 0%, #2a2422 100%); padding: 48px 32px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: rgba(255, 209, 122, 0.2); border-radius: 20px; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(255, 209, 122, 0.3);">
                <div style="width: 48px; height: 48px; background: #ffd17a; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #242021;">
                  ✓
                </div>
              </div>
              <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #ffd17a; line-height: 1.2;">
                Welcome to CreativeMark!
              </h1>
              <p style="margin: 16px 0 0; font-size: 16px; color: rgba(255, 209, 122, 0.8); line-height: 1.5;">
                You're one step away from getting started
              </p>
            </div>

            <!-- Main Content -->
            <div style="padding: 48px 32px;">
              <!-- Greeting -->
              <div style="margin-bottom: 32px;">
                <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: bold; color: #242021;">
                  Hi ${fullName}! 👋
                </h2>
                <p style="margin: 0; font-size: 16px; color: #666; line-height: 1.6;">
                  Thank you for joining <strong style="color: #242021;">CreativeMark</strong>. We're excited to have you on board!
                </p>
              </div>

              <!-- Verification Box -->
              <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 16px; padding: 24px; margin-bottom: 32px; border: 2px solid #e9ecef;">
                <p style="margin: 0 0 24px; font-size: 16px; color: #495057; line-height: 1.6; text-align: center;">
                  To complete your registration and access all features, please verify your email address by clicking the button below:
                </p>
                
                <!-- Verify Button -->
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${verifyLink}" 
                     style="display: inline-block; padding: 18px 42px; background: linear-gradient(135deg, #242021 0%, #2a2422 100%); color: white; text-decoration: none; border-radius: 50px; font-size: 12px; font-weight: bold; box-shadow: 0 8px 24px rgba(36, 32, 33, 0.3); transition: all 0.3s ease;">
                    ✉️ Verify My Email
                  </a>
                </div>

                <!-- Alternative Link -->
                <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #dee2e6;">
                  <p style="margin: 0 0 8px; font-size: 13px; color: #6c757d; text-align: center;">
                    Button not working? Copy and paste this link into your browser:
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #0066cc; word-break: break-all; text-align: center; background: #f8f9fa; padding: 12px; border-radius: 8px;">
                    ${verifyLink}
                  </p>
                </div>
              </div>

              <!-- Important Info -->
              <div style="background: #fff3cd; border-left: 4px solid #ffd17a; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                  <div style="font-size: 24px; line-height: 1;">⏰</div>
                  <div>
                    <p style="margin: 0; font-size: 14px; color: #856404; font-weight: 600;">
                      Important: This verification link will expire in 1 hour
                    </p>
                    <p style="margin: 8px 0 0; font-size: 13px; color: #856404;">
                      If you didn't request this verification, you can safely ignore this email.
                    </p>
                  </div>
                </div>
              </div>

              <!-- What's Next -->
              <div style="margin-bottom: 32px;">
                <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: bold; color: #242021;">
                  What happens next? 🚀
                </h3>
                <div style="space-y: 12px;">
                  <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
                    <div style="width: 24px; height: 24px; background: #242021; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                      <span style="color: #ffd17a; font-size: 14px; font-weight: bold;">1</span>
                    </div>
                    <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">
                      <strong style="color: #242021;">Verify your email</strong> by clicking the button above
                    </p>
                  </div>
                  <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
                    <div style="width: 24px; height: 24px; background: #242021; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                      <span style="color: #ffd17a; font-size: 14px; font-weight: bold;">2</span>
                    </div>
                    <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">
                      <strong style="color: #242021;">Sign in</strong> to your account
                    </p>
                  </div>
                  <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div style="width: 24px; height: 24px; background: #242021; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                      <span style="color: #ffd17a; font-size: 14px; font-weight: bold;">3</span>
                    </div>
                    <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">
                      <strong style="color: #242021;">Start exploring</strong> all our amazing features!
                    </p>
                  </div>
                </div>
              </div>

              <!-- Help Section -->
              <div style="background: #e7f3ff; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="margin: 0 0 12px; font-size: 14px; color: #004085; font-weight: 600;">
                  Need help? We're here for you! 💬
                </p>
                <p style="margin: 0; font-size: 13px; color: #004085;">
                  Email us at <a href="mailto:support@creativemark.com" style="color: #0056b3; text-decoration: none; font-weight: 600;">support@creativemark.com</a>
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f8f9fa; padding: 32px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 16px; font-size: 14px; color: #6c757d; font-weight: 600;">
                Best regards,<br>
                <span style="color: #242021; font-size: 18px; font-weight: bold;">The CreativeMark Team</span>
              </p>
              
              <!-- Social Links (Optional) -->
              <div style="margin: 24px 0;">
                <p style="margin: 0 0 12px; font-size: 12px; color: #adb5bd;">Follow us on social media</p>
                <div style="display: inline-flex; gap: 16px;">
                  <a href="#" style="display: inline-block; width: 36px; height: 36px; background: #242021; border-radius: 50%; text-decoration: none; line-height: 36px; color: #ffd17a; font-weight: bold;">f</a>
                  <a href="#" style="display: inline-block; width: 36px; height: 36px; background: #242021; border-radius: 50%; text-decoration: none; line-height: 36px; color: #ffd17a; font-weight: bold;">𝕏</a>
                  <a href="#" style="display: inline-block; width: 36px; height: 36px; background: #242021; border-radius: 50%; text-decoration: none; line-height: 36px; color: #ffd17a; font-weight: bold;">in</a>
                </div>
              </div>

              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #dee2e6;">
                <p style="margin: 0; font-size: 11px; color: #adb5bd; line-height: 1.5;">
                  © ${new Date().getFullYear()} CreativeMark. All rights reserved.<br>
                  This email was sent to ${normalizedEmail} because you created an account.<br>
                  If you didn't request this, please ignore this email.
                </p>
              </div>
            </div>

          </div>
        </body>
        </html>
      `
    );
    
    return res.status(201).json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ success: false, message: "Invalid or missing token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({ success: true, message: "Email already verified. You can now log in.", alreadyVerified: true });
    }

    // Check if token expired manually (optional)
    if (user.verificationTokenExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "Verification link expired" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Email Verification Error:", error);
    res.status(500).json({ success: false, message: "Invalid or expired token" });
  }
};


// ✅ Send verification email
export const sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isVerified)
      return res.json({ success: true, message: "Email already verified" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    // Update user with new verification token
    user.verificationToken = token;
    user.verificationTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    await sendEmail(
      email,
      `🔄 Verify Your Email - ${process.env.BRAND_NAME}`,
      `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
          <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);">
            
            <!-- Header with Brand Colors -->
            <div style="background: linear-gradient(135deg, #242021 0%, #2a2422 100%); padding: 48px 32px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: rgba(255, 209, 122, 0.2); border-radius: 20px; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(255, 209, 122, 0.3);">
                <div style="width: 48px; height: 48px; background: #ffd17a; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #242021;">
                  📧
                </div>
              </div>
              <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #ffd17a; line-height: 1.2;">
                Verify Your Email
              </h1>
              <p style="margin: 16px 0 0; font-size: 16px; color: rgba(255, 209, 122, 0.8); line-height: 1.5;">
                A new verification link has been sent
              </p>
            </div>

            <!-- Main Content -->
            <div style="padding: 48px 32px;">
              <!-- Greeting -->
              <div style="margin-bottom: 32px;">
                <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: bold; color: #242021;">
                  Hi ${user.fullName}! 👋
                </h2>
                <p style="margin: 0; font-size: 16px; color: #666; line-height: 1.6;">
                  You requested a new verification link for your <strong style="color: #242021;">CreativeMark</strong> account.
                </p>
              </div>

              <!-- Verification Box -->
              <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 16px; padding: 32px; margin-bottom: 32px; border: 2px solid #e9ecef;">
                <p style="margin: 0 0 24px; font-size: 16px; color: #495057; line-height: 1.6; text-align: center;">
                  Click the button below to verify your email address:
                </p>
                
                <!-- Verify Button -->
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${verifyLink}" 
                     style="display: inline-block; padding: 18px 48px; background: linear-gradient(135deg, #242021 0%, #2a2422 100%); color: white; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: bold; box-shadow: 0 8px 24px rgba(36, 32, 33, 0.3);">
                    ✉️ Verify My Email
                  </a>
                </div>

                <!-- Alternative Link -->
                <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #dee2e6;">
                  <p style="margin: 0 0 8px; font-size: 13px; color: #6c757d; text-align: center;">
                    Button not working? Copy and paste this link into your browser:
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #0066cc; word-break: break-all; text-align: center; background: #f8f9fa; padding: 12px; border-radius: 8px;">
                    ${verifyLink}
                  </p>
                </div>
              </div>

              <!-- Important Info -->
              <div style="background: #fff3cd; border-left: 4px solid #ffd17a; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                  <div style="font-size: 24px; line-height: 1;">⏰</div>
                  <div>
                    <p style="margin: 0; font-size: 14px; color: #856404; font-weight: 600;">
                      Important: This verification link will expire in 1 hour
                    </p>
                    <p style="margin: 8px 0 0; font-size: 13px; color: #856404;">
                      If you didn't request this, please ignore this email.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Help Section -->
              <div style="background: #e7f3ff; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="margin: 0 0 12px; font-size: 14px; color: #004085; font-weight: 600;">
                  Need help? We're here for you! 💬
                </p>
                <p style="margin: 0; font-size: 13px; color: #004085;">
                  Email us at <a href="mailto:support@creativemark.com" style="color: #0056b3; text-decoration: none; font-weight: 600;">support@creativemark.com</a>
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f8f9fa; padding: 32px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 16px; font-size: 14px; color: #6c757d; font-weight: 600;">
                Best regards,<br>
                <span style="color: #242021; font-size: 18px; font-weight: bold;">The CreativeMark Team</span>
              </p>
              
              <!-- Social Links -->
              <div style="margin: 24px 0;">
                <p style="margin: 0 0 12px; font-size: 12px; color: #adb5bd;">Follow us on social media</p>
                <div style="display: inline-flex; gap: 16px;">
                  <a href="#" style="display: inline-block; width: 36px; height: 36px; background: #242021; border-radius: 50%; text-decoration: none; line-height: 36px; color: #ffd17a; font-weight: bold;">f</a>
                  <a href="#" style="display: inline-block; width: 36px; height: 36px; background: #242021; border-radius: 50%; text-decoration: none; line-height: 36px; color: #ffd17a; font-weight: bold;">𝕏</a>
                  <a href="#" style="display: inline-block; width: 36px; height: 36px; background: #242021; border-radius: 50%; text-decoration: none; line-height: 36px; color: #ffd17a; font-weight: bold;">in</a>
                </div>
              </div>

              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #dee2e6;">
                <p style="margin: 0; font-size: 11px; color: #adb5bd; line-height: 1.5;">
                  © ${new Date().getFullYear()} CreativeMark. All rights reserved.<br>
                  This email was sent to ${email} because you requested a verification link.<br>
                  If you didn't request this, please ignore this email.
                </p>
              </div>
            </div>

          </div>
        </body>
        </html>
      `
    );

    res.json({ success: true, message: "Verification email sent" });
  } catch (err) {
    console.error("Send verification email error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



/**
 * @desc    Register Admin (protected, main office only)
 * @route   POST /api/auth/register-admin
 * @access  Private (Admin only)
 */

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }
    

    const token = generateToken(user._id, user.role);
  
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // must be HTTPS in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // none for cross-domain in prod
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/", // Ensure cookie is available for all paths
      domain: process.env.NODE_ENV === "production" ? undefined : undefined, // Let browser handle domain
    });
    
    
   

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        phoneCountryCode: user.phoneCountryCode,
        nationality: user.nationality,
        residencyStatus: user.residencyStatus,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc    Logout user (clear cookie)
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logoutUser = (req, res) => {
  try {
    // Clear the token cookie by setting it to expire immediately
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // must be HTTPS in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // allow cross-domain cookies
      maxAge: 0, // Expire immediately
      path: "/", // Ensure cookie is available for all paths
      domain: process.env.NODE_ENV === "production" ? undefined : undefined, // Let browser handle domain
    });
    
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to logout" 
    });
  }
};

/**
 * @desc    Create new user (Employee, Partner, or Admin)
 * @route   POST /api/auth/create-user
 * @access  Private (Admin only)
 */
export const createUser = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
    }

    // Handle both JSON and FormData
    const parseData = (data) => {
      const parsed = {};
      for (const [key, value] of Object.entries(data)) {
        // Handle arrays (skills, permissions, specializations, etc.)
        if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
          try {
            parsed[key] = JSON.parse(value);
          } catch (e) {
            parsed[key] = value;
          }
        } else {
          parsed[key] = value;
        }
      }
      return parsed;
    };

    const formData = parseData(req.body);
    
    const {
      fullName,
      email,
      phone,
      phoneCountryCode,
      password,
      role,
      nationality,
      residencyStatus,
      address,
      profilePicture,
      bio,
      // Employee fields
      position,
      department,
      salary,
      hireDate,
      manager,
      permissions,
      workLocation,
      emergencyContact,
      skills,
      // Partner fields
      partnerType,
      companyName,
      crNumber,
      sharePercentage,
      contractStartDate,
      contractEndDate,
      commissionRate,
      specializations,
      serviceAreas,
      languages,
      availability,
      // Admin fields
      accessLevel
    } = formData;

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, password, and role are required"
      });
    }

    // Validate role
    if (!["employee", "partner", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be employee, partner, or admin"
      });
    }

    // Check if email already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Generate unique ID based on role
    const uniqueId = await User.generateUniqueId(role);

    // Prepare user data
    const userData = {
      fullName,
      email: normalizedEmail,
      phone,
      phoneCountryCode: phoneCountryCode || "+966",
      passwordHash: password,
      role,
      nationality,
      residencyStatus,
      address,
      profilePicture,
      bio,
      isActive: true
    };

    // Add role-specific details
    if (role === "employee") {
      userData.employeeDetails = {
        employeeId: uniqueId,
        position,
        department,
        salary: salary ? parseFloat(salary) : undefined,
        hireDate: hireDate ? new Date(hireDate) : undefined,
        manager,
        permissions: permissions || [],
        workLocation,
        emergencyContact,
        skills: skills || []
      };
    } else if (role === "partner") {
      userData.partnerDetails = {
        partnerId: uniqueId,
        partnerType,
        companyName,
        crNumber,
        sharePercentage: sharePercentage ? parseFloat(sharePercentage) : undefined,
        contractStartDate: contractStartDate ? new Date(contractStartDate) : undefined,
        contractEndDate: contractEndDate ? new Date(contractEndDate) : undefined,
        commissionRate: commissionRate ? parseFloat(commissionRate) : undefined,
        specializations: specializations || [],
        serviceAreas: serviceAreas || [],
        languages: languages || [],
        availability: availability || "available"
      };
    } else if (role === "admin") {
      userData.adminDetails = {
        adminId: uniqueId,
        permissions: permissions || [],
        accessLevel: accessLevel || "admin"
      };
    }

    // Create user
    const user = new User(userData);
    await user.save();

    // Return user data without password
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
      data: userResponse
    });

  } catch (error) {
    console.error("Create User Error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/update-profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Handle both JSON and FormData
    const parseData = (data) => {
      const parsed = {};
      for (const [key, value] of Object.entries(data)) {
        // Handle arrays (skills, permissions, specializations, etc.)
        if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
          try {
            parsed[key] = JSON.parse(value);
          } catch (e) {
            parsed[key] = value;
          }
        } else {
          parsed[key] = value;
        }
      }
      return parsed;
    };

    const formData = parseData(req.body);
    
    // Handle profile picture upload
    let profilePictureUrl = null;
    if (req.file) {
      // File was uploaded via multer and saved to Cloudinary
      profilePictureUrl = req.file.path;
      console.log('Profile picture uploaded to Cloudinary:', profilePictureUrl);
    }
    
    const {
      fullName,
      email,
      phone,
      phoneCountryCode,
      nationality,
      address,
      bio,
      profilePicture,
      // Employee fields
      position,
      department,
      salary,
      hireDate,
      manager,
      permissions,
      workLocation,
      emergencyContact,
      skills,
      // Partner fields
      partnerType,
      companyName,
      crNumber,
      sharePercentage,
      contractStartDate,
      contractEndDate,
      commissionRate,
      specializations,
      serviceAreas,
      languages,
      availability,
      // Admin fields
      accessLevel
    } = formData;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const normalizedEmail = email.toLowerCase().trim();
      const existingUser = await User.findOne({ 
        email: normalizedEmail,
        _id: { $ne: userId }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }
    }

    // Update basic user information
    const updateData = {
      fullName: fullName || user.fullName,
      email: email ? email.toLowerCase().trim() : user.email,
      phone: phone || user.phone,
      phoneCountryCode: phoneCountryCode || user.phoneCountryCode,
      nationality: nationality || user.nationality,
      address: address || user.address,
      bio: bio || user.bio,
      profilePicture: profilePictureUrl || profilePicture || user.profilePicture
    };

    // Update role-specific details based on user role
    if (user.role === "employee") {
      updateData.employeeDetails = {
        ...user.employeeDetails,
        position: position || user.employeeDetails?.position,
        department: department || user.employeeDetails?.department,
        salary: salary ? parseFloat(salary) : user.employeeDetails?.salary,
        hireDate: hireDate ? new Date(hireDate) : user.employeeDetails?.hireDate,
        manager: manager || user.employeeDetails?.manager,
        permissions: permissions || user.employeeDetails?.permissions || [],
        workLocation: workLocation || user.employeeDetails?.workLocation,
        emergencyContact: emergencyContact || user.employeeDetails?.emergencyContact,
        skills: skills || user.employeeDetails?.skills || []
      };
    } else if (user.role === "partner") {
      updateData.partnerDetails = {
        ...user.partnerDetails,
        partnerType: partnerType || user.partnerDetails?.partnerType,
        companyName: companyName || user.partnerDetails?.companyName,
        crNumber: crNumber || user.partnerDetails?.crNumber,
        sharePercentage: sharePercentage ? parseFloat(sharePercentage) : user.partnerDetails?.sharePercentage,
        contractStartDate: contractStartDate ? new Date(contractStartDate) : user.partnerDetails?.contractStartDate,
        contractEndDate: contractEndDate ? new Date(contractEndDate) : user.partnerDetails?.contractEndDate,
        commissionRate: commissionRate ? parseFloat(commissionRate) : user.partnerDetails?.commissionRate,
        specializations: specializations || user.partnerDetails?.specializations || [],
        serviceAreas: serviceAreas || user.partnerDetails?.serviceAreas || [],
        languages: languages || user.partnerDetails?.languages || [],
        availability: availability || user.partnerDetails?.availability || "available"
      };
    } else if (user.role === "admin") {
      updateData.adminDetails = {
        ...user.adminDetails,
        permissions: permissions || user.adminDetails?.permissions || [],
        accessLevel: accessLevel || user.adminDetails?.accessLevel || "admin"
      };
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-passwordHash");

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * @desc    Update user password
 * @route   PUT /api/auth/update-password
 * @access  Private
 */
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long"
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.matchPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Update password
    user.passwordHash = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("Update Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * @desc    Update user settings
 * @route   PUT /api/auth/update-settings
 * @access  Private
 */
export const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settingsData = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update settings
    user.settings = {
      ...user.settings,
      ...settingsData
    };

    await user.save();

    res.json({
      success: true,
      message: "Settings updated successfully",
      data: user.settings
    });

  } catch (error) {
    console.error("Update Settings Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * @desc    Delete user by ID (Admin only)
 * @route   DELETE /api/auth/users/:id
 * @access  Private (Admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }

    const { id } = req.params;
    const { deletedBy } = req.body;

    // Validate required fields
    if (!deletedBy) {
      return res.status(400).json({
        success: false,
        message: "Deleted by user ID is required"
      });
    }

    // Validate user ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    // Find user to ensure it exists
    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account"
      });
    }

    // Verify the user deleting has permission (admin)
    const deletingUser = await User.findById(deletedBy);
    if (!deletingUser || deletingUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Only admin can delete users"
      });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    // Emit notification if needed (optional)
    const io = req.app.get('io');
    if (io) {
      // You can add notification logic here if needed
      console.log(`User ${userToDelete.fullName} deleted by ${deletingUser.fullName}`);
    }

    res.json({
      success: true,
      message: "User deleted successfully",
      data: {
        userId: id,
        deletedUser: {
          name: userToDelete.fullName,
          email: userToDelete.email,
          role: userToDelete.role
        },
        deletedBy: deletingUser.fullName,
        deletedAt: new Date()
      }
    });

  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Get Current User Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
