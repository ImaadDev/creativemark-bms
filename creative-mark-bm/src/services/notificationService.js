import api from './api';

/**
 * Notification Service
 * Handles all notification-related API calls
 */

// Get all notifications for a user
export const getNotifications = async (userId) => {
  try {
    console.log('🔔 Fetching notifications for user:', userId);
    const response = await api.get(`/notifications/${userId}`);
    console.log('📨 Notifications response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error headers:', error.response?.headers);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Create notification (for testing purposes)
export const createNotification = async (notificationData) => {
  try {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get unread notification count
export const getUnreadCount = async (userId) => {
  try {
    console.log('🔢 Fetching unread count for user:', userId);
    const response = await api.get(`/notifications/${userId}/unread-count`);
    console.log('📊 Unread count response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching unread count:', error);
    console.error('❌ Error response:', error.response?.data);
    throw error;
  }
};

// Mark all notifications as read for a user
export const markAllAsRead = async (userId) => {
  try {
    const response = await api.patch(`/notifications/${userId}/mark-all-read`);
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};