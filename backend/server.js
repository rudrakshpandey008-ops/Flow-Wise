// ============================================================================
// FLOWWISE — Full-Stack Server Entry Point
// ============================================================================

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

// Route Handlers
import authRoutes from './src/routes/auth.js';
import journeyRoutes from './src/routes/journeys.js';
import crowdRoutes from './src/routes/crowd.js';
import predictionRoutes from './src/routes/prediction.js';
import analyticsRoutes from './src/routes/analytics.js';
import routeRoutes from './src/routes/routes.js';
import errorHandler from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Attach io instance to express app so routes can broadcast updates
app.set('io', io);

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Socket.IO Connection & Events
io.on('connection', (socket) => {
  console.log(`🔌 [Socket.IO] Client connected: ${socket.id}`);

  // Automatically join crowd updates channel
  socket.join('crowd-updates');

  socket.on('disconnect', () => {
    console.log(`🔌 [Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/journeys', journeyRoutes);
app.use('/api/crowd', crowdRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/routes', routeRoutes);

// Root health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'FLOWWISE',
    tagline: 'Navigate Smarter. Travel Freer.',
    version: '1.0.0',
    mode: process.env.DEMO_MODE === 'true' ? 'Demo Mode' : 'Production',
    timestamp: new Date().toISOString()
  });
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Attempt database connection (gracefully continues in DEMO_MODE if offline)
    await connectDB();

    server.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║   🧭  F L O W W I S E                                              ║
║   Navigate Smarter. Travel Freer.                                  ║
║                                                                    ║
║   Backend Server running on: http://localhost:${PORT}               ║
║   Socket.IO Gateway active                                         ║
║   Crowd Engine & Prediction Algorithms initialized                 ║
║   Demo Region: Mathura & Vrindavan, Uttar Pradesh                  ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (err) {
    console.error('Fatal server startup error:', err);
  }
};

startServer();
