import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDatabase } from './config/database.js';
import { registerNotificationChannel } from './services/realtimeService.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN?.split(',') || '*',
    credentials: true,
  },
});

registerNotificationChannel(io);

connectDatabase()
  .then(() => {
    server.listen(PORT, () => {
      logger.info(`GuffGaff API listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Failed to start server', error);
    process.exit(1);
  });

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection', error);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});
