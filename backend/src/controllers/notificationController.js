import User from '../models/User.js';

export const listNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('notifications');
    res.json({ notifications: user?.notifications ?? [] });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(204).end();

    const notification = user.notifications.id(notificationId);
    if (notification) {
      notification.isRead = true;
      await user.save();
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const createNotification = async ({ userId, type, message, link }) => {
  const user = await User.findById(userId);
  if (!user || user.settings?.muteNotifications) return;
  user.notifications.unshift({ type, message, link });
  if (user.notifications.length > 50) {
    user.notifications = user.notifications.slice(0, 50);
  }
  await user.save();
  return user.notifications[0];
};
