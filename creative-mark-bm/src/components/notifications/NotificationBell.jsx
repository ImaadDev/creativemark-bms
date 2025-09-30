"use client";

import { useState } from "react";
import { useNotifications } from "../../contexts/NotificationContext"; 
import NotificationCenter from "./NotificationCenter";

const NotificationBell = () => {
  const { unreadCount, notifications, addNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  // Debug logging
  console.log('🔔 NotificationBell - Unread count:', unreadCount);
  console.log('🔔 NotificationBell - All notifications:', notifications);

  // Test function to add a notification manually
  const testNotification = () => {
    addNotification({
      type: 'test',
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working',
      timestamp: new Date(),
      read: false
    });
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)} 
          onDoubleClick={testNotification}
          className="relative p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Notifications"
          title="Click to open notifications, double-click to test"
        >
          {/* Bell Icon */}
          <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          
          {/* Unread Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg ring-2 ring-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      <NotificationCenter 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};

export default NotificationBell;