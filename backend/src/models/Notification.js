import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['like', 'comment', 'reply', 'verification', 'badge', 'admin'],
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    commentId: { type: mongoose.Schema.Types.ObjectId },
    message: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
