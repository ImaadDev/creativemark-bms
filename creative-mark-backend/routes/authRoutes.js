import express from "express";
import { registerUser, loginUser, getCurrentUser, logoutUser, createUser, updateProfile, updatePassword, updateSettings, deleteUser } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload, { handleUploadError } from "../config/upload.js";

const router = express.Router();

// Register new user
router.post("/register", registerUser);



// Create new user (Employee, Partner, or Admin) - Admin only
router.post("/create-user", authMiddleware, createUser);

// Login user
router.post("/login", loginUser);

// Get current user (protected route)
router.get("/me", authMiddleware, getCurrentUser);

// Update user profile (protected route) - with file upload support
router.put("/update-profile", authMiddleware, upload.single('profilePicture'), handleUploadError, updateProfile);

// Update user password (protected route)
router.put("/update-password", authMiddleware, updatePassword);

// Update user settings (protected route)
router.put("/update-settings", authMiddleware, updateSettings);

// Delete user (Admin only)
router.delete("/users/:id", authMiddleware, deleteUser);

// Logout user
router.post("/logout", logoutUser);

export default router;
