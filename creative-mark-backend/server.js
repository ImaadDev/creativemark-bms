import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import errorMiddleware from './middlewares/errorMiddleware.js';


// Routes
import applicationRoutes from './routes/appliactionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = createServer(app);

// Socket.IO setup
console.log("Socket.IO CORS Configuration - CLIENT_URL:", process.env.CLIENT_URL);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io instance available to routes
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);
  
  socket.on('join_user_room', (userId) => {
    console.log(`👤 User ${userId} joined personal room`);
    socket.join(`user_${userId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
  
  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });
});

// Middleware
console.log("CORS Configuration - CLIENT_URL:", process.env.CLIENT_URL);
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000", // Frontend URL
  credentials: true // Allow cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Creative Mark BMS API is running!' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});


app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
  });

  // Join application-specific room
  socket.on('join_application_room', (applicationId) => {
    socket.join(`application_${applicationId}`);
    console.log(`User joined application room: ${applicationId}`);
  });

  // Leave application-specific room
  socket.on('leave_application_room', (applicationId) => {
    socket.leave(`application_${applicationId}`);
    console.log(`User left application room: ${applicationId}`);
  });

  // Handle new message
  socket.on('send_message', async (messageData) => {
    try {
      // Import models here to avoid circular dependency
      const Message = (await import('./models/Message.js')).default;
      const Application = (await import('./models/Application.js')).default;
      const User = (await import('./models/User.js')).default;
      
      // Get application to determine recipient
      const application = await Application.findById(messageData.applicationId);
      if (!application) {
        socket.emit('message_error', { error: 'Application not found' });
        return;
      }

      // Determine recipient based on sender role and application
      let recipientId = null;
      const sender = await User.findById(messageData.senderId);
      
      if (sender.role === 'client') {
        // Client can message with assigned employees
        if (application.assignedEmployees && application.assignedEmployees.length > 0) {
          recipientId = application.assignedEmployees[0].employeeId;
        }
      } else if (sender.role === 'employee') {
        // Employee can message with the client
        recipientId = application.userId;
      }

      if (!recipientId) {
        socket.emit('message_error', { error: 'No recipient found for this conversation' });
        return;
      }

      // Create message with recipient ID
      const message = new Message({
        ...messageData,
        recipientId
      });
      
      await message.save();
      
      // Populate sender and recipient details
      await message.populate([
        { path: 'senderId', select: 'fullName email role' },
        { path: 'recipientId', select: 'fullName email role' }
      ]);

      // Emit message to both sender and recipient
      io.to(`user_${messageData.senderId}`).emit('new_message', message);
      io.to(`user_${recipientId}`).emit('new_message', message);
      
      // Also emit to application room
      io.to(`application_${messageData.applicationId}`).emit('new_message', message);
      
      console.log('Message sent:', message._id);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    socket.to(`application_${data.applicationId}`).emit('user_typing', {
      userId: data.userId,
      isTyping: true
    });
  });

  socket.on('typing_stop', (data) => {
    socket.to(`application_${data.applicationId}`).emit('user_typing', {
      userId: data.userId,
      isTyping: false
    });
  });

  // Handle message read status
  socket.on('mark_messages_read', async (data) => {
    try {
      const Message = (await import('./models/Message.js')).default;
      
      await Message.markAsRead(data.messageIds, data.userId);
      
      // Notify sender that messages were read
      io.to(`user_${data.senderId}`).emit('messages_read', {
        messageIds: data.messageIds,
        readBy: data.userId
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server is ready`);
});
