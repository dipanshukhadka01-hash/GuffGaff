import mongoose from 'mongoose';

const moodTags = ['serious', 'fun', 'advice', 'rant'];
const postTypes = ['question', 'help', 'rant', 'fun'];

const reactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['like', 'fun', 'helpful'] },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    audioUrl: { type: String },
    replies: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        audioUrl: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    type: { type: String, enum: postTypes, default: 'question' },
    content: { type: String },
    audioUrl: { type: String },
    moodTag: { type: String, enum: moodTags },
    reactions: { type: [reactionSchema], default: [] },
    comments: { type: [commentSchema], default: [] },
    isSolved: { type: Boolean, default: false },
    solvedCommentId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

postSchema.methods.toggleReaction = function ({ userId, type }) {
  const existing = this.reactions.find(
    (reaction) => reaction.user.toString() === userId && reaction.type === type
  );

  if (existing) {
    this.reactions = this.reactions.filter((reaction) => reaction._id.toString() !== existing._id.toString());
  } else {
    this.reactions.push({ user: userId, type });
  }
};

export const Post = mongoose.model('Post', postSchema);
