import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    title: { type: String },
    isGroup: { type: Boolean, default: false },
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);
