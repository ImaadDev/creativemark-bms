import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import connectDB from './config/db.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import { initializeSocket, setupSocketHandlers } from './utils/socketHandler.js';


// Routes
import applicationRoutes from './routes/appliactionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server, process.env.CLIENT_URL);

// Make io instance available to routes
app.set('io', io);

// Setup socket event handlers
setupSocketHandlers(io);


// Middleware
console.log("CORS Configuration - CLIENT_URL:", process.env.CLIENT_URL);
console.log("CORS Configuration - NODE_ENV:", process.env.NODE_ENV);

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
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
app.use('/api/partners', partnerRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/notifications', notificationRoutes);


// Error handling middleware
app.use(errorMiddleware);


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server is ready`);
});
