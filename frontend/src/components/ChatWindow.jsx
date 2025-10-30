import { useEffect, useRef } from 'react';

export const ChatWindow = ({ messages = [], onSend }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const content = formData.get('message');
    if (!content.trim()) return;
    onSend(content);
    event.currentTarget.reset();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl bg-guff-sand/50 p-4">
        {messages.map((message) => (
          <div key={message._id} className="rounded-2xl bg-white px-4 py-2 text-sm shadow-sm">
            <p className="font-semibold text-guff-dusk">{message.sender?.username}</p>
            <p className="text-slate-600">{message.content}</p>
            <p className="text-xs text-slate-400">{new Date(message.createdAt).toLocaleTimeString()}</p>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          name="message"
          placeholder="Send a kind note..."
          className="flex-1 rounded-full border border-guff-sand px-4 py-2 text-sm focus:border-guff-sky focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-guff-sky px-4 py-2 text-sm font-semibold text-white hover:bg-guff-dusk"
        >
          Send
        </button>
      </form>
    </div>
  );
};
