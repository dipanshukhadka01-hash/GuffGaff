import { ChatBubbleLeftRightIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';

const moodLabel = {
  serious: '🧐 Serious',
  fun: '😄 Fun',
  advice: '💬 Advice',
  rant: '😤 Rant',
};

export const PostCard = ({ post, onReact, onVerify, onSolve }) => {
  return (
    <article className="rounded-3xl border border-guff-sand bg-white/80 p-5 shadow-sm">
      <header className="flex items-center gap-3">
        <img
          src={post.author?.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author?.username}`}
          alt="avatar"
          className="h-10 w-10 rounded-full border border-guff-sand"
        />
        <div>
          <h3 className="text-sm font-semibold text-guff-dusk">{post.author?.username}</h3>
          <p className="text-xs text-slate-500">{moodLabel[post.moodTag] || '😊 Friendly'}</p>
        </div>
        <span className="ml-auto rounded-full bg-guff-sand px-3 py-1 text-xs font-medium text-guff-dusk">
          {post.type.toUpperCase()}
        </span>
      </header>
      <p className="mt-4 text-sm leading-relaxed text-slate-700">{post.content}</p>
      <footer className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <button
          type="button"
          onClick={() => onReact?.(post._id, 'like')}
          className="flex items-center gap-1 rounded-full bg-guff-sand px-3 py-1 text-guff-dusk hover:bg-guff-sky/20"
        >
          <HandThumbUpIcon className="h-4 w-4" /> {post.reactions?.length || 0}
        </button>
        <span className="flex items-center gap-1 rounded-full bg-guff-sand px-3 py-1 text-guff-dusk">
          <ChatBubbleLeftRightIcon className="h-4 w-4" /> {post.comments?.length || 0}
        </span>
        {post.isSolved ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-600">✅ Solved</span>
        ) : null}
        {!post.isSolved && onSolve
          ? post.comments?.map((comment) => (
              <button
                key={comment._id}
                type="button"
                onClick={() => onSolve(post._id, comment._id)}
                className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-100"
              >
                Mark {comment.author?.username || 'helper'} solved
              </button>
            ))
          : null}
        {!post.isSolved && post.comments?.some((comment) => comment.isVerified) && onVerify
          ? post.comments
              .filter((comment) => comment.isVerified)
              .map((comment) => (
                <button
                  key={comment._id}
                  type="button"
                  onClick={() => onVerify(post._id, comment._id)}
                  className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-600"
                >
                  ✅ Verified
                </button>
              ))
          : null}
      </footer>
    </article>
  );
};
