import { Notification } from '../models/Notification.js';
import { firebaseAdmin } from '../config/firebaseAdmin.js';
import { logger } from '../utils/logger.js';

let ioInstance;

export const bindSocketServer = (io) => {
  ioInstance = io;
};

export const createNotification = async ({
  recipient,
  actor,
  type,
  post,
  commentId,
  message,
}) => {
  const notification = await Notification.create({
    recipient,
    actor,
    type,
    post,
    commentId,
    message,
  });

  if (ioInstance) {
    ioInstance.to(String(recipient)).emit('notification:new', notification);
  }

  try {
    if (firebaseAdmin?.messaging && process.env.FIREBASE_MESSAGING_SENDER_ID) {
      await firebaseAdmin.messaging().sendEachForMulticast({
        tokens: [], // Clients should register device tokens via a dedicated endpoint
        notification: {
          title: 'GuffGaff',
          body: message || 'You have a new notification',
        },
        data: {
          type,
          post: post ? String(post) : '',
          commentId: commentId ? String(commentId) : '',
        },
      });
    }
  } catch (error) {
    logger.warn('Failed to send push notification', error);
  }

  return notification;
};
