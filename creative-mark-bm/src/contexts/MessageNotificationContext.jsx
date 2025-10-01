"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const MessageNotificationContext = createContext();

export const MessageNotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Poll for new messages every 30 seconds
  useEffect(() => {
    if (!user) return;

    const pollForMessages = async () => {
      try {
        // Import the service dynamically to avoid circular imports
        const { getUnreadCount } = await import("../services/messageService");
        const response = await getUnreadCount();
        if (response.success) {
          setUnreadCount(response.unreadCount);
        }
      } catch (error) {
        // Only log error if it's not a network error (backend not running)
        if (!error.message.includes('Network Error') && !error.code === 'ECONNREFUSED') {
          console.error("Error polling for messages:", error);
        }
        // Set unread count to 0 if backend is not available
        setUnreadCount(0);
      }
    };

    // Initial poll
    pollForMessages();

    // Set up polling interval
    const interval = setInterval(pollForMessages, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  // Add notification
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
  };

  // Clear notification
  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Mark as read
  const markAsRead = () => {
    setUnreadCount(0);
  };

  const value = {
    unreadCount,
    notifications,
    isConnected,
    addNotification,
    clearNotification,
    clearAllNotifications,
    markAsRead,
    setUnreadCount
  };

  return (
    <MessageNotificationContext.Provider value={value}>
      {children}
    </MessageNotificationContext.Provider>
  );
};

export const useMessageNotifications = () => {
  const context = useContext(MessageNotificationContext);
  if (!context) {
    throw new Error("useMessageNotifications must be used within a MessageNotificationProvider");
  }
  return context;
};

export default MessageNotificationContext;
