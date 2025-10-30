import mongoose from 'mongoose';
import { BADGE_TYPES, getRankForPoints } from '../utils/gamification.js';

const statsSchema = new mongoose.Schema(
  {
    posts: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    reactions: {
      fun: { type: Number, default: 0 },
      helpful: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

const badgeSchema = new mongoose.Schema(
  {
    type: { type: String, enum: Object.values(BADGE_TYPES) },
    awardedAt: { type: Date, default: Date.now },
    reason: { type: String },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, index: true },
    username: { type: String, required: true, unique: true },
    bio: { type: String, maxlength: 250 },
    location: { type: String, maxlength: 120 },
    profileImageUrl: { type: String },
    roles: { type: [String], default: ['user'] },
    paybackPoints: { type: Number, default: 0 },
    rank: { type: String, default: 'Newbie' },
    badges: { type: [badgeSchema], default: [] },
    interests: { type: [String], default: [] },
    stats: { type: statsSchema, default: () => ({}) },
    notificationSettings: {
      likes: { type: Boolean, default: true },
      replies: { type: Boolean, default: true },
      verified: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

userSchema.methods.awardBadge = function (type, reason) {
  if (!this.badges.find((badge) => badge.type === type)) {
    this.badges.push({ type, reason });
  }
};

userSchema.methods.addPaybackPoints = function (amount) {
  this.paybackPoints += amount;
  this.rank = getRankForPoints(this.paybackPoints);
};

export const User = mongoose.model('User', userSchema);
