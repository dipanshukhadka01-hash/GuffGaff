import { useEffect, useState } from 'react';
import { fetchNotifications, markNotificationRead } from '../services/api.js';
import { NotificationCard } from '../components/NotificationCard.jsx';
import { useSocket } from '../contexts/SocketContext.jsx';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    const load = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };
    load();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const listener = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };
    socket.on('notification:new', listener);
    return () => socket.off('notification:new', listener);
  }, [socket]);

  const handleRead = async (notificationId) => {
    const updated = await markNotificationRead(notificationId);
    setNotifications((prev) =>
      prev.map((notification) => (notification._id === updated._id ? updated : notification))
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-guff-dusk">Notifications</h1>
        <p className="text-sm text-slate-500">Stay in the loop when others lift you up.</p>
      </div>
      {notifications.length === 0 ? (
        <p className="text-sm text-slate-500">No notifications yet — go sprinkle some kindness!</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationCard key={notification._id} notification={notification} onRead={handleRead} />
          ))}
        </div>
      )}
    </div>
  );
};
