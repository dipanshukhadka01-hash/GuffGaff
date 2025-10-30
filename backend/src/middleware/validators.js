import { body } from 'express-validator';

export const signupValidator = [
  body('email').isEmail().withMessage('A valid email is required.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Please choose a password at least 6 characters long.'),
  body('username').notEmpty().withMessage('Pick a friendly username!')
];

export const loginValidator = [
  body('email').isEmail(),
  body('password').notEmpty()
];

export const postValidator = [
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Share a few words with the community!')
];
