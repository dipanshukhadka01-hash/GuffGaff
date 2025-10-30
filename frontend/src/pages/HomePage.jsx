import { useEffect, useState } from 'react';
import PostComposer from '../components/PostComposer.jsx';
import PostCard from '../components/PostCard.jsx';
import { fetchFeed } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';

export default function HomePage() {
  const { token } = useAuth();
  const { socket } = useSocket();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await fetchFeed(token);
        setPosts(items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  useEffect(() => {
    if (!socket) return;
    const handler = (post) => setPosts((prev) => [post, ...prev]);
    socket.on('feed:update', handler);
    return () => {
      socket.off('feed:update', handler);
    };
  }, [socket]);

  const handlePost = (post) => setPosts((prev) => [post, ...prev]);
  const handleUpdate = (updated) =>
    setPosts((prev) => prev.map((post) => (post._id === updated._id ? updated : post)));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-primary/10 via-white to-secondary/20 p-8">
        <h1 className="text-3xl font-black text-slate-800">Welcome back to the square</h1>
        <p className="mt-2 text-slate-600">
          Share something delightful, lend a hand, or ask for support. Every interaction earns Payback
          Points and keeps the vibes bright.
        </p>
      </div>

      <PostComposer onPost={handlePost} />

      {loading ? (
        <p className="text-center text-sm text-slate-500">Fetching the latest banter...</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onUpdate={handleUpdate} />
          ))}
          {!posts.length && <p className="text-center text-sm text-slate-500">No posts yet. Break the ice!</p>}
        </div>
      )}
    </div>
  );
}
