import express from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';
import validateRequest from '../middleware/validation.js';
import { registerSchema, loginSchema } from '../validation/auth.schema.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/logout', logout);

// Google Login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/',
  })
);

export default router;
