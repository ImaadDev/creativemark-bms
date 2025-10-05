import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// Create new notification (admin, system, etc.)
router.post("/", createNotification);

// Get all notifications for a specific user
router.get("/:userId", getUserNotifications);

// Mark one as read
router.put("/:notificationId/read", markAsRead);

// Delete one
router.delete("/:notificationId", deleteNotification);

export default router;
