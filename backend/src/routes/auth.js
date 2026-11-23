// ============================================================================
// FLOWWISE — Authentication Routes
// ============================================================================

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import memoryStore from '../services/memoryStore.js';

const router = express.Router();

const isDbConnected = () => mongoose.connection.readyState === 1;

const signToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'flowwise_super_secret_jwt_key_hackathon_2026_production',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, defaultNavigationMode, transportMode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password (minimum 6 characters)'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    // Database or MemoryStore
    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email already registered' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        preferences: {
          defaultNavigationMode: defaultNavigationMode || 'balanced',
          transportMode: transportMode || 'walking',
          alertNotifications: true
        }
      });

      const token = signToken(user);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferences: user.preferences
        }
      });
    } else {
      // Memory Store fallback
      const existing = memoryStore.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, error: 'Email already registered' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = memoryStore.createUser({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        preferences: {
          defaultNavigationMode: defaultNavigationMode || 'balanced',
          transportMode: transportMode || 'walking',
          alertNotifications: true
        }
      });

      const token = signToken(newUser);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          preferences: newUser.preferences
        }
      });
    }
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    let user;
    if (isDbConnected()) {
      user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    } else {
      user = memoryStore.findUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const token = signToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences || {
          defaultNavigationMode: 'balanced',
          transportMode: 'walking',
          alertNotifications: true
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res, next) => {
  try {
    let user;
    if (isDbConnected() && !req.user.isDemo) {
      user = await User.findById(req.user.id);
    } else {
      user = memoryStore.findUserById(req.user.id) || memoryStore.users[0];
    }

    if (!user) {
      // Fallback demo user
      user = {
        _id: 'usr_demo_001',
        name: 'Radhika Sharma',
        email: 'demo@flowwise.app',
        preferences: {
          defaultNavigationMode: 'balanced',
          transportMode: 'walking',
          alertNotifications: true
        }
      };
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
