export const NotificationCard = ({ notification, onRead }) => {
  return (
    <div
      className={`rounded-3xl border border-guff-sand px-4 py-3 text-sm shadow-sm ${
        notification.isRead ? 'bg-white' : 'bg-guff-sand/60'
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="font-medium text-guff-dusk">{notification.message}</p>
        {!notification.isRead && (
          <button
            type="button"
            onClick={() => onRead(notification._id)}
            className="text-xs font-semibold text-guff-sky hover:text-guff-dusk"
          >
            Mark read
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {new Date(notification.createdAt).toLocaleString()}
      </p>
    </div>
  );
};
