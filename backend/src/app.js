import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { authRouter } from './routes/authRoutes.js';
import { forumRouter } from './routes/forumRoutes.js';
import { feedRouter } from './routes/feedRoutes.js';
import { leaderboardRouter } from './routes/leaderboardRoutes.js';
import { notificationRouter } from './routes/notificationRoutes.js';
import { chatRouter } from './routes/chatRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { attachUser } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(',') || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(attachUser);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'GuffGaff API is alive' });
});

app.use('/api/auth', authRouter);
app.use('/api/forums', forumRouter);
app.use('/api/feed', feedRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/chat', chatRouter);
app.use('/api/admin', adminRouter);

app.use(errorHandler);

export default app;
