export const ForumList = ({ posts = [], onSolve }) => {
  if (!posts.length) {
    return <p className="text-sm text-slate-500">No discussions yet. Start the first conversation!</p>;
  }

  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <li key={post._id}>
          <div className="rounded-3xl border border-guff-sand bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-guff-dusk">{post.content}</h3>
                <p className="text-xs text-slate-500">{post.author?.username}</p>
              </div>
              {post.isSolved ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  ✅ Solved
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onSolve?.(post._id)}
                  className="rounded-full bg-guff-sky px-3 py-1 text-xs font-semibold text-white hover:bg-guff-dusk"
                >
                  Mark Solved
                </button>
              )}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {post.comments?.length || 0} replies · {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};
