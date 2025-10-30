import { useState } from 'react';
import { SparklesIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import { createPost } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const categories = [
  { value: 'general', label: 'Just vibing' },
  { value: 'tech', label: 'Tech' },
  { value: 'diy', label: 'DIY' },
  { value: 'study', label: 'Study Help' },
  { value: 'wellness', label: 'Wellness' }
];

const moodTags = [
  { value: 'fun', label: '😄 Fun' },
  { value: 'serious', label: '🧐 Serious' },
  { value: 'advice', label: '💬 Advice' },
  { value: 'rant', label: '😤 Rant' }
];

const postTypes = [
  { value: 'fun', label: 'Just for Fun' },
  { value: 'question', label: 'Question' },
  { value: 'offer', label: 'Offering Help' },
  { value: 'rant', label: 'Rant' }
];

export default function PostComposer({ onPost }) {
  const { token } = useAuth();
  const [form, setForm] = useState({ content: '', category: 'general', moodTag: 'fun', postType: 'fun' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.content.trim()) return;
    try {
      setSubmitting(true);
      const post = await createPost(token, form);
      onPost?.(post);
      setForm({ content: '', category: 'general', moodTag: 'fun', postType: 'fun' });
    } catch (error) {
      console.error(error);
      alert('Could not share your guff just yet. Try again?');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70"
    >
      <div className="flex items-start gap-4">
        <SparklesIcon className="mt-1 h-8 w-8 text-secondary" />
        <div className="flex-1 space-y-4">
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={3}
            placeholder="Share something uplifting, ask for help, or drop a witty line..."
            className="w-full resize-none"
          />
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <select
                name="postType"
                value={form.postType}
                onChange={handleChange}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm"
              >
                {postTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <select
                name="moodTag"
                value={form.moodTag}
                onChange={handleChange}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm"
              >
                {moodTags.map((tag) => (
                  <option key={tag.value} value={tag.value}>
                    {tag.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-dashed border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-500"
                onClick={() => alert('Audio clips coming soon!')}
              >
                <MicrophoneIcon className="h-5 w-5" />
                Add audio
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 disabled:opacity-50"
              >
                {submitting ? 'Sharing...' : 'Share good vibes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
