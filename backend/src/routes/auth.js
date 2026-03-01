const express = require('express');
const { z } = require('zod');

const User = require('../models/User');
const { signAccessToken } = require('../utils/jwt');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      phone: z.string().optional(),
      city: z.string().optional(),
    });
    const body = schema.parse(req.body);

    const exists = await User.findOne({ email: body.email });
    if (exists) {
      const err = new Error('Email already registered');
      err.statusCode = 409;
      throw err;
    }

    const user = await User.create({
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone || '',
      city: body.city || '',
    });

    const token = signAccessToken(user._id.toString());
    const safeUser = await User.findById(user._id).select('-password');

    res.json({ success: true, token, user: safeUser });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });
    const body = schema.parse(req.body);

    const user = await User.findOne({ email: body.email }).select('+password');
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }
    if (user.isBlocked) {
      const err = new Error('User is blocked');
      err.statusCode = 403;
      throw err;
    }

    const ok = await user.comparePassword(body.password);
    if (!ok) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const token = signAccessToken(user._id.toString());
    const safeUser = await User.findById(user._id).select('-password');

    res.json({ success: true, token, user: safeUser });
  } catch (e) {
    next(e);
  }
});

router.get('/me', requireAuth(), async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;

