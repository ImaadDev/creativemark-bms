"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const newSocket = io(backendUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('✅ Socket connected successfully');
        setIsConnected(true);
        
        // Join user's personal room
        newSocket.emit('join_user_room', user.id);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message);
        setIsConnected(false);
      });

      newSocket.on('error', (error) => {
        console.error('❌ Socket error:', error);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        console.log('🧹 Cleaning up socket connection');
        newSocket.close();
      };
    } else {
      // If no user, close any existing socket
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user]);

  // Join application room
  const joinApplicationRoom = (applicationId) => {
    if (socket && isConnected) {
      try {
        socket.emit('join_application_room', applicationId);
        console.log('📱 Joined application room:', applicationId);
      } catch (error) {
        console.error('❌ Error joining application room:', error);
      }
    } else {
      console.warn('⚠️ Socket not connected, cannot join application room');
    }
  };

  // Leave application room
  const leaveApplicationRoom = (applicationId) => {
    if (socket && isConnected) {
      try {
        socket.emit('leave_application_room', applicationId);
        console.log('📱 Left application room:', applicationId);
      } catch (error) {
        console.error('❌ Error leaving application room:', error);
      }
    }
  };

  // Send message
  const sendMessage = (messageData) => {
    if (socket && isConnected) {
      try {
        socket.emit('send_message', messageData);
        console.log('📤 Message sent via socket:', messageData.applicationId);
      } catch (error) {
        console.error('❌ Error sending message via socket:', error);
      }
    } else {
      console.warn('⚠️ Socket not connected, message not sent via socket');
    }
  };

  // Send typing indicator
  const sendTypingStart = (applicationId, userId) => {
    if (socket && isConnected) {
      socket.emit('typing_start', { applicationId, userId });
    }
  };

  const sendTypingStop = (applicationId, userId) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', { applicationId, userId });
    }
  };

  // Mark messages as read
  const markMessagesAsRead = (messageIds, senderId) => {
    if (socket && isConnected) {
      socket.emit('mark_messages_read', {
        messageIds,
        userId: user.id,
        senderId
      });
    }
  };

  // Listen for new messages
  const onNewMessage = (callback) => {
    if (socket) {
      socket.on('new_message', callback);
      return () => socket.off('new_message', callback);
    }
  };

  // Listen for typing indicators
  const onUserTyping = (callback) => {
    if (socket) {
      socket.on('user_typing', callback);
      return () => socket.off('user_typing', callback);
    }
  };

  // Listen for message read status
  const onMessagesRead = (callback) => {
    if (socket) {
      socket.on('messages_read', callback);
      return () => socket.off('messages_read', callback);
    }
  };

  // Listen for message errors
  const onMessageError = (callback) => {
    if (socket) {
      socket.on('message_error', callback);
      return () => socket.off('message_error', callback);
    }
  };

  const value = {
    socket,
    isConnected,
    joinApplicationRoom,
    leaveApplicationRoom,
    sendMessage,
    sendTypingStart,
    sendTypingStop,
    markMessagesAsRead,
    onNewMessage,
    onUserTyping,
    onMessagesRead,
    onMessageError
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export default SocketContext;
