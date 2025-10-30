import { useEffect, useState } from 'react';
import { addForumComment, fetchCategories, fetchForumPosts, markPostSolved } from '../services/api.js';
import { ForumList } from '../components/ForumList.jsx';

export const ForumPage = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('General');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data.length ? data : ['General']);
      setActiveCategory(data[0] || 'General');
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    const loadPosts = async () => {
      const data = await fetchForumPosts(activeCategory);
      setPosts(data);
    };
    loadPosts();
  }, [activeCategory]);

  const handleSolve = async (postId) => {
    const post = posts.find((item) => item._id === postId);
    if (!post || !post.comments?.length) return;
    const solved = await markPostSolved(postId, post.comments[0]._id);
    setPosts((prev) => prev.map((item) => (item._id === solved._id ? solved : item)));
  };

  const handleQuickReply = async (postId) => {
    const reply = await addForumComment(postId, {
      content: 'Sending you good vibes and a friendly nudge! ✅',
    });
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId ? { ...post, comments: [...post.comments, reply] } : post
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              category === activeCategory
                ? 'bg-guff-sky text-white shadow'
                : 'bg-guff-sand text-guff-dusk hover:bg-guff-sky/20'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <ForumList posts={posts} onSolve={handleSolve} />
      <div className="rounded-3xl border border-guff-sand bg-white p-4 text-sm text-slate-500 shadow-sm">
        Tip: Need a hand? Ask away — someone will earn Payback Points by helping you!
      </div>
      <div className="rounded-3xl bg-guff-sand/60 p-4 text-sm text-guff-dusk">
        Want to boost morale? Pick a thread and drop a quick encouragement.
        <div className="mt-3 flex flex-wrap gap-2">
          {posts.map((post) => (
            <button
              key={`${post._id}-reply`}
              type="button"
              onClick={() => handleQuickReply(post._id)}
              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-guff-sky shadow"
            >
              Cheer {post.author?.username}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
