import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    title: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isGroup: { type: Boolean, default: false },
    lastMessageAt: { type: Date, default: Date.now },
    typingUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export default mongoose.model('Conversation', conversationSchema);
