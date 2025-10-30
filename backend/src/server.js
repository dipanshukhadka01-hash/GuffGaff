import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import createError from 'http-errors';
import { connectDatabase } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { createSocketServer } from './services/socket.js';
import { initFirebaseAdmin } from './config/firebase.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GuffGaff API – a cozy corner for helpful banter.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res, next) => {
  next(createError(404, 'Route not found.'));
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.expose ? error.message : 'Something went wrong. Please try again.';
  res.status(status).json({ message, ...(error.errors ? { errors: error.errors } : {}) });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase(process.env.MONGODB_URI || 'mongodb://localhost:27017/guffgaff');
  initFirebaseAdmin();

  const httpServer = http.createServer(app);
  const socketServer = createSocketServer(httpServer, {
    corsOrigin: process.env.CLIENT_ORIGIN || '*'
  });

  app.set('socketServer', socketServer);

  httpServer.listen(PORT, () => {
    console.log(`🚀 GuffGaff API listening on port ${PORT}`);
  });
};

startServer();
