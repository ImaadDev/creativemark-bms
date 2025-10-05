import api from './api';

export const fetchNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const clearAllNotifications = async () => {
  try {
    const response = await api.delete('/notifications/clear');
    return response.data;
  } catch (error) {
    console.error('Error clearing notifications:', error);
    throw error;
  }
};
