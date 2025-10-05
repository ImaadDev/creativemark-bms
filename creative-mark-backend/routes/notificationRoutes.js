import express from 'express';
import { getNotifications, markAsRead, clearAll } from '../controllers/notificationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/notifications - Get all notifications for the authenticated user
router.get('/', getNotifications);

// PATCH /api/notifications/:id/read - Mark a notification as read
router.patch('/:id/read', markAsRead);

// DELETE /api/notifications/clear - Clear all notifications for the authenticated user
router.delete('/clear', clearAll);

export default router;