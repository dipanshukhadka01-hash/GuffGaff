import { bindSocketServer } from './notificationService.js';

export const registerNotificationChannel = (io) => {
  bindSocketServer(io);

  io.on('connection', (socket) => {
    const { userId } = socket.handshake.query;
    if (userId) {
      socket.join(String(userId));
    }

    socket.on('disconnect', () => {
      socket.leave(String(userId));
    });
  });
};
