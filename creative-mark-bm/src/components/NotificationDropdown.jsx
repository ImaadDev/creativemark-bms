"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "../contexts/SocketContext";
import { useAuth } from "../contexts/AuthContext";
import { Bell, X, Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { notifications, unreadCount, markNotificationsAsRead, markNotificationAsRead, clearAllNotifications, fetchNotifications } = useSocket();
  const { user } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications when dropdown opens or on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        console.log('❌ No user ID for fetching notifications');
        return;
      }
      console.log('🔔 Fetching notifications for user:', user.id);
      setLoading(true);
      try {
        await fetchNotifications();
        console.log('✅ Notifications fetched successfully');
      } catch (error) {
        console.error('❌ Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markNotificationsAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      await clearAllNotifications();
      setIsOpen(false);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    try {
      // Mark as read if not already read
      if (!notification.read && (notification._id || notification.id)) {
        handleMarkAsRead(notification._id || notification.id);
      }

      // Navigate based on notification type and data
      const applicationId = notification.data?.applicationId;
      switch (user?.role) {
        case "admin":
          router.push(applicationId ? `/admin/requests` : `/admin`);
          break;
        case "employee":
          router.push(applicationId ? `/employee/my-tasks` : `/employee`);
          break;
        case "client":
        default:
          router.push(applicationId ? `/client/track-application/${applicationId}` : `/client`);
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const formatTime = (timestamp) => {
    try {
      if (!timestamp) return "Unknown time";
      
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "Invalid date";
      
      const now = new Date();
      const diffMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffMinutes < 1) return "Just now";
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Unknown time";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success": return "✅";
      case "warning": return "⚠️";
      case "error": return "❌";
      default: return "ℹ️";
    }
  };

  if (!user) return null;

  // Debug logging
  console.log('🔔 NotificationDropdown render:', {
    user: user?.id,
    notifications: notifications.length,
    unreadCount,
    loading
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
          isOpen ? "bg-blue-50 text-blue-600 shadow-lg scale-105" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:scale-105"
        }`}
        aria-label="Notifications"
      >
        <Bell className={`h-6 w-6 transition-transform duration-300 ${isOpen ? "rotate-12" : "hover:rotate-6"}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-bounce">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-3 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
                  <p className="text-xs text-slate-600">
                    {notifications.length > 0 ? `${notifications.length} ${notifications.length === 1 ? "notification" : "notifications"}` : "No notifications"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {notifications.length > 0 && (
                  <button onClick={handleClearAllNotifications} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200" title="Clear all notifications">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                {notifications.some(n => !n.read) && (
                  <button onClick={handleMarkAllAsRead} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-200">
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto bg-white/50">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-600 animate-pulse">Loading notifications...</p>
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium mb-1">No notifications yet</p>
                  <p className="text-xs text-slate-500 text-center">You'll receive notifications here when there are updates about your applications.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {notifications.filter(notification => notification && (notification._id || notification.id)).map((notification, index) => (
                    <motion.div
                      key={notification._id || notification.id || `notification-${index}`}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`group relative px-6 py-4 border-b border-slate-100 hover:bg-slate-50/80 cursor-pointer transition-all duration-200 ${
                        !notification.read ? "bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-l-4 border-l-blue-500" : "hover:shadow-sm"
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${!notification.read ? "bg-blue-500 shadow-lg" : "bg-slate-200 group-hover:bg-slate-300"}`}>
                          <span className={`text-lg ${!notification.read ? "text-white" : "text-slate-600"}`}>
                            {getNotificationIcon(notification.type)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-semibold mb-1 transition-colors group-hover:text-slate-900 ${!notification.read ? "text-slate-900" : "text-slate-700"}`}>
                                {notification.title || "Notification"}
                              </h4>
                              <p className={`text-sm leading-relaxed mb-2 transition-colors ${!notification.read ? "text-slate-700" : "text-slate-600"}`}>
                                {notification.message || notification.description || "No message available"}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-500 font-medium">
                                  {notification.createdAt ? formatTime(notification.createdAt) : "Unknown time"}
                                </p>
                                {notification.data?.applicationId && (
                                  <div className="flex items-center space-x-1 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                                    <span>View Application</span>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>
                            {!notification.read && <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse ml-2 flex-shrink-0"></div>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100/50 border-t border-slate-200/50 text-center">
                <button className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto">
                  <span>View all notifications</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
