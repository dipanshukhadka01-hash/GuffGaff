import { useEffect, useState } from 'react';
import { fetchConversations, fetchMessages, sendMessage, startConversation } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';

export default function ChatPage() {
  const { token, user } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const loadConversations = async () => {
      const items = await fetchConversations(token);
      setConversations(items);
      if (items.length) setSelectedConversation(items[0]);
    };
    loadConversations();
  }, [token]);

  useEffect(() => {
    if (!selectedConversation) return;
    const loadMessages = async () => {
      const items = await fetchMessages(token, selectedConversation._id || selectedConversation.id);
      setMessages(items);
    };
    loadMessages();
  }, [token, selectedConversation]);

  useEffect(() => {
    if (!socket || !selectedConversation) return;
    const handler = (message) => {
      if (message.conversation === selectedConversation._id) {
        setMessages((prev) => [...prev, message]);
      }
    };
    socket.emit('chat:join', { conversationId: selectedConversation._id });
    socket.on('chat:message', handler);
    return () => socket.off('chat:message', handler);
  }, [socket, selectedConversation]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!draft.trim() || !selectedConversation) return;
    const message = await sendMessage(token, selectedConversation._id || selectedConversation.id, {
      content: draft
    });
    setMessages((prev) => [...prev, message]);
    setDraft('');
  };

  const handleStartConversation = async () => {
    const partner = prompt('Enter the user id to chat with:');
    if (!partner) return;
    const conversation = await startConversation(token, { memberIds: [partner] });
    setConversations((prev) => [conversation, ...prev]);
    setSelectedConversation(conversation);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
      <aside className="rounded-3xl bg-white p-4 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-700">Chats</h2>
          <button type="button" onClick={handleStartConversation} className="text-sm font-semibold text-primary">
            New chat
          </button>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {conversations.map((conversation) => (
            <li key={conversation._id}
              className={`cursor-pointer rounded-2xl px-3 py-2 ${
                selectedConversation?._id === conversation._id ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              {conversation.isGroup ? conversation.title :
                conversation.members.filter((member) => member._id !== user?.id).map((member) => member.username).join(', ') ||
                'Private chat'}
            </li>
          ))}
          {!conversations.length && <p className="text-xs text-slate-500">Start a chat with someone helpful.</p>}
        </ul>
      </aside>

      <section className="flex flex-col rounded-3xl bg-white shadow">
        {selectedConversation ? (
          <>
            <header className="border-b border-slate-200 p-4">
              <h3 className="font-semibold text-slate-700">
                {selectedConversation.isGroup
                  ? selectedConversation.title
                  : selectedConversation.members
                      .filter((member) => member._id !== user?.id)
                      .map((member) => member.username)
                      .join(', ') || 'Private chat'}
              </h3>
            </header>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`max-w-sm rounded-2xl px-4 py-2 text-sm shadow ${
                    message.sender?._id === user?.id
                      ? 'ml-auto bg-primary text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {!messages.length && <p className="text-sm text-slate-500">Say hi to get things rolling.</p>}
            </div>
            <form onSubmit={handleSend} className="border-t border-slate-200 p-4">
              <div className="flex gap-3">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Type a thoughtful message..."
                  className="flex-1"
                />
                <button type="submit" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
            Choose a conversation to see the messages.
          </div>
        )}
      </section>
    </div>
  );
}
