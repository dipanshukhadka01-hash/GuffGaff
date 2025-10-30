import mongoose from 'mongoose';

const moodTags = ['serious', 'fun', 'advice', 'rant'];
const postTypes = ['question', 'offer', 'rant', 'fun'];

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['tech', 'diy', 'study', 'wellness', 'general'],
      default: 'general'
    },
    postType: {
      type: String,
      enum: postTypes,
      default: 'fun'
    },
    moodTag: {
      type: String,
      enum: moodTags,
      default: 'fun'
    },
    content: {
      type: String,
      trim: true,
      default: ''
    },
    audioUrl: { type: String, default: '' },
    likeIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    shareCount: { type: Number, default: 0 },
    solved: { type: Boolean, default: false },
    solvedComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

postSchema.virtual('likeCount').get(function likeCount() {
  return this.likeIds.length;
});

export default mongoose.model('Post', postSchema);
