import { useState } from 'react';

const POST_TYPES = [
  { value: 'question', label: 'Question' },
  { value: 'help', label: 'Offering Help' },
  { value: 'rant', label: 'Rant' },
  { value: 'fun', label: 'Just for Fun' },
];

const MOOD_TAGS = [
  { value: 'serious', label: '🧐 Serious' },
  { value: 'fun', label: '😄 Fun' },
  { value: 'advice', label: '💬 Advice' },
  { value: 'rant', label: '😤 Rant' },
];

export const PostComposer = ({ onSubmit, categoryOptions = [] }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState('fun');
  const [category, setCategory] = useState(categoryOptions[0] || 'General');
  const [moodTag, setMoodTag] = useState('fun');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    onSubmit({ content, type, category, moodTag });
    setContent('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-guff-sand bg-white p-4 shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-4">
        <select
          className="rounded-full border-guff-sand bg-guff-sand/50 px-4 py-2 text-sm"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          {POST_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          className="rounded-full border-guff-sand bg-guff-sand/50 px-4 py-2 text-sm"
          value={moodTag}
          onChange={(event) => setMoodTag(event.target.value)}
        >
          {MOOD_TAGS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          className="rounded-full border-guff-sand bg-guff-sand/50 px-4 py-2 text-sm"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Share a cheerful thought or ask for help..."
        className="mt-4 w-full rounded-2xl border border-guff-sand px-4 py-3 text-sm focus:border-guff-sky focus:outline-none"
      />
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          className="rounded-full bg-guff-sky px-5 py-2 text-sm font-medium text-white shadow hover:bg-guff-dusk"
        >
          Post it
        </button>
      </div>
    </form>
  );
};
