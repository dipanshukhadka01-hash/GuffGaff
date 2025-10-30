import { useEffect, useState } from 'react';
import { addComment, fetchComments, likeComment } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function CommentThread({ post, onSolved }) {
  const { token, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const items = await fetchComments(token, post._id || post.id);
        setComments(items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, post._id, post.id]);

  const handleLike = async (commentId) => {
    try {
      const updated = await likeComment(token, post._id || post.id, commentId);
      setComments((prev) => prev.map((comment) => (comment._id === updated._id ? updated : comment)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    try {
      const comment = await addComment(token, post._id || post.id, { content: draft });
      setComments((prev) => [...prev, comment]);
      setDraft('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex items-start gap-3">
        <img
          className="mt-1 h-10 w-10 rounded-full object-cover"
          src={user?.profilePicture || `https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.username}`}
          alt={user?.username}
        />
        <div className="flex-1 space-y-2">
          <textarea
            rows={2}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Be helpful, be kind..."
            className="w-full"
          />
          <div className="flex justify-end">
            <button type="submit" className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white">
              Respond
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-slate-500">Loading thread...</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment._id} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={comment.author?.profilePicture || `https://api.dicebear.com/7.x/thumbs/svg?seed=${comment.author?.username}`}
                  alt={comment.author?.username}
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-700">{comment.author?.username}</p>
                    <p className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleString()}</p>
                    {comment.isVerified && (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{comment.content}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => handleLike(comment._id)}
                      className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-500 hover:border-primary hover:text-primary"
                    >
                      ❤️ {comment.likeIds?.length || comment.likeCount || 0}
                    </button>
                    {post.author?.id === user?.id && !post.solved && (
                      <button
                        type="button"
                        onClick={() => onSolved(comment._id)}
                        className="rounded-full border border-primary px-3 py-1 font-semibold text-primary"
                      >
                        Mark as solved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
          {!comments.length && <p className="text-sm text-slate-500">Be the first to respond.</p>}
        </ul>
      )}
    </div>
  );
}
