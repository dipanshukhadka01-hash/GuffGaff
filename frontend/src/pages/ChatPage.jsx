import { useEffect, useState } from 'react';
import { ChatWindow } from '../components/ChatWindow.jsx';
import { createConversation, fetchConversations, fetchMessages, sendMessage } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

export const ChatPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchConversations();
      setConversations(data);
      setActiveConversation(data[0] || null);
    };
    load();
  }, []);

  useEffect(() => {
    if (!activeConversation) return;
    const loadMessages = async () => {
      const data = await fetchMessages(activeConversation._id);
      setMessages(data);
    };
    loadMessages();
  }, [activeConversation]);

  const handleSend = async (content) => {
    if (!activeConversation) return;
    const message = await sendMessage(activeConversation._id, { content });
    setMessages((prev) => [...prev, { ...message, sender: { username: user.username } }]);
  };

  const handleNewConversation = async () => {
    const conversation = await createConversation({ participantIds: [], title: 'Notes to self' });
    setConversations((prev) => [conversation, ...prev]);
    setActiveConversation(conversation);
  };

  return (
    <div className="grid gap-6 md:grid-cols-[260px_1fr]">
      <aside className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-guff-dusk">Chats</h2>
          <button
            type="button"
            onClick={handleNewConversation}
            className="rounded-full bg-guff-sky px-3 py-1 text-xs font-semibold text-white"
          >
            New
          </button>
        </div>
        <ul className="space-y-2">
          {conversations.map((conversation) => (
            <li key={conversation._id}>
              <button
                type="button"
                onClick={() => setActiveConversation(conversation)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${
                  activeConversation?._id === conversation._id
                    ? 'bg-guff-sky text-white shadow'
                    : 'bg-white text-guff-dusk shadow-sm'
                }`}
              >
                {conversation.title ||
                  conversation.participants
                    .filter((participant) => participant._id !== user._id)
                    .map((participant) => participant.username)
                    .join(', ')}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <section className="rounded-3xl border border-guff-sand bg-white p-4 shadow-sm">
        {activeConversation ? (
          <ChatWindow messages={messages} onSend={handleSend} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Pick a conversation or start a new one to spread cheer.
          </div>
        )}
      </section>
    </div>
  );
};
