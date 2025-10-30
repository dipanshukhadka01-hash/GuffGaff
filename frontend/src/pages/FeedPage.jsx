import { useEffect, useState } from 'react';
import { fetchFeed, createFeedPost, reactToPost } from '../services/api.js';
import { PostComposer } from '../components/PostComposer.jsx';
import { PostCard } from '../components/PostCard.jsx';

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchFeed();
      setPosts(data);
    };
    load();
  }, []);

  const handleCreate = async (payload) => {
    const newPost = await createFeedPost(payload);
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleReact = async (postId, type) => {
    const updated = await reactToPost(postId, type);
    setPosts((prev) => prev.map((post) => (post._id === updated._id ? updated : post)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-guff-dusk">The Banter Feed</h1>
        <p className="text-sm text-slate-500">Share warm laughs, thoughtful advice, and good-natured grumbles.</p>
      </div>
      <PostComposer onSubmit={handleCreate} categoryOptions={['Banter', 'DIY', 'Study', 'Support']} />
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} onReact={handleReact} />
        ))}
      </div>
    </div>
  );
};
