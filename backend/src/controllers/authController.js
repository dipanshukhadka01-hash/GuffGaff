import { validationResult } from 'express-validator';
import { firebaseAdmin } from '../config/firebaseAdmin.js';
import { User } from '../models/User.js';
import { PAYBACK_ACTIONS } from '../utils/gamification.js';

export const registerProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { idToken, username, bio, location, interests } = req.body;
    if (!firebaseAdmin?.apps?.length) {
      return res.status(500).json({ message: 'Firebase admin SDK not configured' });
    }

    const { uid, email, picture } = await firebaseAdmin.auth().verifyIdToken(idToken);

    const existing = await User.findOne({ firebaseUid: uid });
    if (existing) {
      return res.status(200).json(existing);
    }

    const user = await User.create({
      firebaseUid: uid,
      email,
      username,
      bio,
      location,
      interests,
      profileImageUrl: picture,
    });

    user.addPaybackPoints(PAYBACK_ACTIONS.DAILY_LOGIN);
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const syncSession = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!firebaseAdmin?.apps?.length) {
      return res.status(500).json({ message: 'Firebase admin SDK not configured' });
    }

    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
    const user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const generatePasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!firebaseAdmin?.apps?.length) {
      return res.status(500).json({ message: 'Firebase admin SDK not configured' });
    }

    const link = await firebaseAdmin.auth().generatePasswordResetLink(email);
    res.json({ message: 'Password reset link generated', link });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await firebaseAdmin.auth().deleteUser(req.user.firebaseUid);
    await User.deleteOne({ _id: req.user._id });

    res.json({ message: 'Account removed' });
  } catch (error) {
    next(error);
  }
};
