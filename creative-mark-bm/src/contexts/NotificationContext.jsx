"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      setUnreadCount(parsed.filter(n => !n.read).length);
    }
  }, []);

  // Save notifications to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Listen for status update notifications
  useEffect(() => {
    if (socket && isConnected) {
      const handleStatusUpdate = (notificationData) => {
        const notification = {
          id: Date.now() + Math.random(),
          type: 'status_update',
          title: 'Application Status Updated',
          message: notificationData.message,
          applicationId: notificationData.applicationId,
          status: notificationData.status,
          updatedBy: notificationData.updatedBy,
          note: notificationData.note,
          timestamp: new Date(),
          read: false
        };

        setNotifications(prev => [notification, ...prev.slice(0, 49)]);

        // Show browser notification if permission is granted
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            tag: `status-update-${notificationData.applicationId}`
          });
        }
      };

      socket.on('status_update_notification', handleStatusUpdate);

      return () => {
        socket.off('status_update_notification', handleStatusUpdate);
      };
    }
  }, [socket, isConnected]);

  // Listen for assignment notifications
  useEffect(() => {
    if (socket && isConnected) {
      const handleAssignmentNotification = (notificationData) => {
        const notification = {
          id: Date.now() + Math.random(),
          type: 'assignment',
          title: 'Task Assigned',
          message: notificationData.message,
          applicationId: notificationData.applicationId,
          assignedBy: notificationData.assignedBy,
          note: notificationData.note,
          timestamp: new Date(),
          read: false
        };

        setNotifications(prev => [notification, ...prev.slice(0, 49)]);

        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            tag: `assignment-${notificationData.applicationId}`
          });
        }
      };

      socket.on('assignment_notification', handleAssignmentNotification);

      return () => {
        socket.off('assignment_notification', handleAssignmentNotification);
      };
    }
  }, [socket, isConnected]);

  // Listen for new application notifications (for admins only)
  useEffect(() => {
    if (socket && isConnected && user && user.role === 'admin') {
      
      const handleNewApplicationNotification = (notificationData) => {
        
        const notification = {
          id: Date.now() + Math.random(),
          type: 'new_application',
          title: 'New Application Submitted',
          message: notificationData.message,
          applicationId: notificationData.applicationId,
          serviceType: notificationData.serviceType,
          partnerType: notificationData.partnerType,
          submittedBy: notificationData.submittedBy,
          submittedAt: notificationData.submittedAt,
          timestamp: new Date(),
          read: false
        };

        setNotifications(prev => [notification, ...prev.slice(0, 49)]);

        // Show browser notification
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            tag: `new-application-${notificationData.applicationId}`
          });
        } else {
          console.log('🔔 Browser notification permission not granted');
        }
      };

      socket.on('new_application_notification', handleNewApplicationNotification);

      return () => {
        socket.off('new_application_notification', handleNewApplicationNotification);
      };
    } else {
      console.log('🔔 Admin notification listener not set up:', { 
        socket: !!socket, 
        isConnected, 
        user: user ? `${user.fullName} (${user.role})` : 'none' 
      });
    }
  }, [socket, isConnected, user]);

  // Listen for task assignment notifications
  useEffect(() => {
    if (socket && isConnected) {
      const handleTaskAssignmentNotification = (notificationData) => {
        const notification = {
          id: Date.now() + Math.random(),
          type: 'task_assignment',
          title: 'New Task Assigned',
          message: notificationData.title,
          taskId: notificationData.taskId,
          description: notificationData.description,
          priority: notificationData.priority,
          dueDate: notificationData.dueDate,
          assignedBy: notificationData.assignedBy,
          applicationId: notificationData.applicationId,
          timestamp: new Date(),
          read: false
        };

        setNotifications(prev => [notification, ...prev.slice(0, 49)]);

        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            tag: `task-assignment-${notificationData.taskId}`
          });
        }
      };

      socket.on('task_assignment_notification', handleTaskAssignmentNotification);

      return () => {
        socket.off('task_assignment_notification', handleTaskAssignmentNotification);
      };
    }
  }, [socket, isConnected]);

  // Listen for task status update notifications
  useEffect(() => {
    if (socket && isConnected) {
      const handleTaskStatusUpdateNotification = (notificationData) => {
        const notification = {
          id: Date.now() + Math.random(),
          type: 'task_status_update',
          title: 'Task Status Updated',
          message: `${notificationData.title} status changed to ${notificationData.status}`,
          taskId: notificationData.taskId,
          status: notificationData.status,
          updatedBy: notificationData.updatedBy,
          note: notificationData.note,
          timestamp: new Date(),
          read: false
        };

        setNotifications(prev => [notification, ...prev.slice(0, 49)]);

        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            tag: `task-status-${notificationData.taskId}`
          });
        }
      };

      socket.on('task_status_update_notification', handleTaskStatusUpdateNotification);

      return () => {
        socket.off('task_status_update_notification', handleTaskStatusUpdateNotification);
      };
    }
  }, [socket, isConnected]);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Clear notification
  const clearNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Get notifications for specific application
  const getNotificationsForApplication = (applicationId) => {
    return notifications.filter(n => n.applicationId === applicationId);
  };

  // Add a new notification manually (for testing)
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    console.log('🔔 Adding notification manually:', newNotification);
    setNotifications(prev => {
      const updated = [newNotification, ...prev.slice(0, 49)];
      console.log('🔔 Updated notifications after manual add:', updated);
      return updated;
    });
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    getNotificationsForApplication,
    requestNotificationPermission,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export default NotificationContext;
