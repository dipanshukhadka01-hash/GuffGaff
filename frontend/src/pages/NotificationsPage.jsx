import { useEffect, useState } from 'react';
import { fetchNotifications, markNotificationRead } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';

export default function NotificationsPage() {
  const { token } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await fetchNotifications(token);
        setNotifications(items);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [token]);

  useEffect(() => {
    if (!socket) return;
    const handler = (notification) => setNotifications((prev) => [notification, ...prev]);
    socket.on('notifications:new', handler);
    return () => socket.off('notifications:new', handler);
  }, [socket]);

  const handleRead = async (notificationId) => {
    try {
      await markNotificationRead(token, notificationId);
      setNotifications((prev) => prev.map((notification) =>
        notification._id === notificationId ? { ...notification, isRead: true } : notification
      ));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
        <p className="mt-2 text-sm text-slate-500">Stay in the loop when someone likes, replies, or verifies your help.</p>
      </header>
      <section className="space-y-3">
        {notifications.map((notification) => (
          <article
            key={notification._id}
            className={`rounded-3xl border p-4 shadow-sm transition ${
              notification.isRead ? 'border-slate-100 bg-white' : 'border-primary/30 bg-primary/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">{notification.message}</p>
              {!notification.isRead && (
                <button
                  type="button"
                  onClick={() => handleRead(notification._id)}
                  className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white"
                >
                  Mark read
                </button>
              )}
            </div>
          </article>
        ))}
        {!notifications.length && <p className="text-sm text-slate-500">Quiet for now. Spread some kindness!</p>}
      </section>
    </div>
  );
}
