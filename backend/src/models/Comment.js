import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, trim: true, default: '' },
    audioUrl: { type: String, default: '' },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    likeIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

commentSchema.virtual('likeCount').get(function likeCount() {
  return this.likeIds.length;
});

export default mongoose.model('Comment', commentSchema);
