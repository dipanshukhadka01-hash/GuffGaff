import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { calculateRank } from '../utils/rank.js';

const socialLinkSchema = new mongoose.Schema(
  {
    label: String,
    url: String
  },
  { _id: false }
);

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['like', 'comment', 'verify', 'message', 'system'],
      default: 'system'
    },
    message: String,
    link: String,
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    googleId: { type: String },
    username: { type: String, required: true, unique: true },
    bio: { type: String, default: '' },
    profilePicture: { type: String, default: '' },
    location: { type: String, default: '' },
    paybackPoints: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    solvedCount: { type: Number, default: 0 },
    funCount: { type: Number, default: 0 },
    socialLinks: { type: [socialLinkSchema], default: [] },
    notifications: { type: [notificationSchema], default: [] },
    roles: { type: [String], default: ['member'] },
    settings: {
      muteNotifications: { type: Boolean, default: false },
      theme: { type: String, default: 'daylight' }
    }
  },
  { timestamps: true }
);

userSchema.virtual('rank').get(function rank() {
  return calculateRank(this.paybackPoints);
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

export default mongoose.model('User', userSchema);
