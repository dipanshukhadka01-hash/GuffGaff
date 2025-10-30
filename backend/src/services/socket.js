import { Server } from 'socket.io';
import { createNotification } from '../controllers/notificationController.js';
import { verifyAccessToken } from '../utils/token.js';
import User from '../models/User.js';

export const createSocketServer = (httpServer, { corsOrigin = '*' } = {}) => {
  const io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,
      credentials: true
    }
  });

  const userSocketMap = new Map();

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next();
      const decoded = verifyAccessToken(token.replace('Bearer ', ''));
      const user = await User.findById(decoded.sub).select('id');
      if (user) {
        socket.data.userId = user.id;
      }
    } catch (error) {
      console.error('Socket authentication error', error);
    }
    next();
  });

  io.on('connection', (socket) => {
    if (socket.data.userId) {
      userSocketMap.set(socket.data.userId, socket.id);
      socket.join(socket.data.userId);
    }

    socket.on('auth:register', (userId) => {
      userSocketMap.set(userId, socket.id);
      socket.join(userId);
    });

    socket.on('chat:typing', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('chat:typing', { conversationId, userId });
    });

    socket.on('chat:join', ({ conversationId }) => {
      socket.join(conversationId);
    });

    socket.on('disconnect', () => {
      if (socket.data.userId) {
        userSocketMap.delete(socket.data.userId);
      } else {
        for (const [userId, socketId] of userSocketMap.entries()) {
          if (socketId === socket.id) {
            userSocketMap.delete(userId);
            break;
          }
        }
      }
    });
  });

  const pushNotification = async ({ userId, type, message, link }) => {
    const notification = await createNotification({ userId, type, message, link });
    if (notification) {
      io.to(userId.toString()).emit('notifications:new', notification);
    }
  };

  const broadcastFeedUpdate = (post) => {
    io.emit('feed:update', post);
  };

  return { io, pushNotification, broadcastFeedUpdate };
};
