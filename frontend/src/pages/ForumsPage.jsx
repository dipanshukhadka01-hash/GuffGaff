import { useEffect, useMemo, useState } from 'react';
import PostCard from '../components/PostCard.jsx';
import { fetchFeed } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const categories = [
  { value: 'general', label: 'All categories' },
  { value: 'tech', label: 'Tech' },
  { value: 'diy', label: 'DIY' },
  { value: 'study', label: 'Study help' },
  { value: 'wellness', label: 'Wellness' }
];

const types = [
  { value: '', label: 'All post types' },
  { value: 'question', label: 'Questions' },
  { value: 'offer', label: 'Offering help' },
  { value: 'fun', label: 'Just for fun' },
  { value: 'rant', label: 'Rants' }
];

export default function ForumsPage() {
  const { token } = useAuth();
  const [filters, setFilters] = useState({ category: 'general', postType: '', moodTag: '' });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useMemo(() => {
    const p = {};
    if (filters.category && filters.category !== 'general') p.category = filters.category;
    if (filters.postType) p.postType = filters.postType;
    if (filters.moodTag) p.moodTag = filters.moodTag;
    return p;
  }, [filters]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchFeed(token, params);
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, params]);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Mutual Assistance Forums</h1>
        <p className="mt-2 text-sm text-slate-500">
          Dive into categories to get help or lend your expertise. Verified solutions earn chunky Payback Points.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <select
            value={filters.category}
            onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <select
            value={filters.postType}
            onChange={(event) => setFilters((prev) => ({ ...prev, postType: event.target.value }))}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm"
          >
            {types.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <select
            value={filters.moodTag}
            onChange={(event) => setFilters((prev) => ({ ...prev, moodTag: event.target.value }))}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm"
          >
            <option value="">All moods</option>
            <option value="fun">😄 Fun</option>
            <option value="serious">🧐 Serious</option>
            <option value="advice">💬 Advice</option>
            <option value="rant">😤 Rant</option>
          </select>
        </div>
      </header>

      {loading ? (
        <p className="text-sm text-slate-500">Loading forums...</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onUpdate={(updated) =>
              setPosts((prev) => prev.map((item) => (item._id === updated._id ? updated : item)))
            } />
          ))}
          {!posts.length && <p className="text-sm text-slate-500">No threads yet. Start one!</p>}
        </div>
      )}
    </div>
  );
}
