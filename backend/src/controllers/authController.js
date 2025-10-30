import createError from 'http-errors';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { signAccessToken } from '../utils/token.js';
import { evaluateBadges } from '../utils/badges.js';
import { verifyFirebaseToken } from '../config/firebase.js';

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  username: user.username,
  bio: user.bio,
  profilePicture: user.profilePicture,
  location: user.location,
  paybackPoints: user.paybackPoints,
  badges: user.badges,
  rank: user.rank,
  roles: user.roles,
  solvedCount: user.solvedCount,
  funCount: user.funCount
});

export const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, { errors: errors.array() }));
    }

    const { email, password, username } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return next(createError(409, 'Email already registered.'));
    }

    const user = await User.create({ email, password, username });
    const accessToken = signAccessToken({ sub: user.id });
    res.status(201).json({ token: accessToken, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, { errors: errors.array() }));
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return next(createError(401, 'Invalid credentials.'));
    }

    const accessToken = signAccessToken({ sub: user.id });
    res.json({ token: accessToken, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return next(createError(400, 'Missing idToken.'));
    }

    const decoded = await verifyFirebaseToken(idToken);
    if (!decoded) {
      return next(createError(401, 'Unable to verify Google identity.'));
    }

    const { uid, email, name, picture } = decoded;
    let user = await User.findOne({ $or: [{ googleId: uid }, { email }] });
    if (!user) {
      user = await User.create({
        email,
        googleId: uid,
        username: name || email.split('@')[0],
        profilePicture: picture
      });
    }

    const token = signAccessToken({ sub: user.id });
    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, 'User not found.'));
    }

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    if (!user) {
      return next(createError(404, 'User not found.'));
    }

    const badges = evaluateBadges({
      points: user.paybackPoints,
      solvedCount: user.solvedCount,
      funCount: user.funCount
    });

    user.badges = Array.from(new Set([...user.badges, ...badges]));
    await user.save();

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'If that address exists, a reset email will be sent.' });
    }

    // In a production environment this would send the request to Firebase or Auth0.
    console.info(`Password reset requested for ${email}.`);
    res.json({ message: 'Password reset email dispatched.' });
  } catch (error) {
    next(error);
  }
};

export const verifyTokenController = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};
