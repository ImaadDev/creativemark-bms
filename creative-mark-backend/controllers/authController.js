import User from "../models/User.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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

    const user = new User({
      fullName,
      email: normalizedEmail,
      phone,
      nationality,
      residencyStatus,
      passwordHash: password,
      role: "client", // always client
    });

    await user.save();

    const token = generateToken(user._id, user.role);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Client registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Client Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
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
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({ success: true, message: "Logged out successfully" });
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
    
    const {
      fullName,
      email,
      phone,
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
      nationality: nationality || user.nationality,
      address: address || user.address,
      bio: bio || user.bio,
      profilePicture: profilePicture || user.profilePicture
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
