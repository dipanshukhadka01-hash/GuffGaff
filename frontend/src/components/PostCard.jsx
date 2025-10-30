import { useState } from 'react';
import { HandThumbUpIcon, ChatBubbleOvalLeftIcon, ShareIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import CommentThread from './CommentThread.jsx';
import { togglePostLike, markPostSolved } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const moodEmojis = {
  fun: '😄 Fun',
  serious: '🧐 Serious',
  advice: '💬 Advice',
  rant: '😤 Rant'
};

export default function PostCard({ post, onUpdate }) {
  const { token, user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleLike = async () => {
    setProcessing(true);
    try {
      const updated = await togglePostLike(token, post._id || post.id);
      onUpdate?.(updated);
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleSolved = async (commentId) => {
    setProcessing(true);
    try {
      const updated = await markPostSolved(token, post._id || post.id, commentId);
      onUpdate?.(updated);
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <article className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/70">
      <header className="flex items-start gap-3">
        <img
          className="h-12 w-12 rounded-full object-cover"
          src={post.author?.profilePicture || `https://api.dicebear.com/7.x/thumbs/svg?seed=${post.author?.username}`}
          alt={post.author?.username}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">{post.author?.username}</p>
              <p className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleString()}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {moodEmojis[post.moodTag]}
            </span>
          </div>
          <div className="mt-3 space-y-3">
            <p className="text-slate-700">{post.content}</p>
            {post.audioUrl && (
              <audio controls className="w-full">
                <source src={post.audioUrl} />
              </audio>
            )}
            {post.solved && post.solvedComment && (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                <CheckBadgeIcon className="h-5 w-5" />
                Solution verified by {post.verifiedBy?.username || 'OP'}
              </div>
            )}
          </div>
        </div>
      </header>

      <footer className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
        <button
          type="button"
          onClick={handleLike}
          disabled={processing}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 font-semibold transition ${
            post.likeIds?.includes(user?.id) ? 'border-primary text-primary' : 'border-slate-200 hover:border-primary'
          }`}
        >
          <HandThumbUpIcon className="h-5 w-5" /> {post.likeIds?.length || post.likeCount || 0}
        </button>
        <button
          type="button"
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:border-primary"
        >
          <ChatBubbleOvalLeftIcon className="h-5 w-5" /> Comments
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:border-primary"
          onClick={() => alert('Sharing will be wired up to the marketing page soon!')}
        >
          <ShareIcon className="h-5 w-5" /> Share
        </button>
      </footer>

      {showComments && (
        <div className="mt-6">
          <CommentThread post={post} onSolved={handleSolved} />
        </div>
      )}
    </article>
  );
}
