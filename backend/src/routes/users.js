const express = require('express');
const { z } = require('zod');

const User = require('../models/User');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');
const { uploadImage } = require('../utils/cloudinary');

const router = express.Router();

router.get('/me', requireAuth(), async (req, res) => {
  res.json({ success: true, user: req.user });
});

// Upload or update profile picture (Cloudinary)
router.post('/me/avatar', requireAuth(), uploadAvatar, async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error('No image file provided');
      err.statusCode = 400;
      throw err;
    }
    const { url } = await uploadImage(req.file.buffer, req.file.mimetype);
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatar: url } },
      { new: true }
    ).select('-password');
    res.json({ success: true, user: updated });
  } catch (e) {
    next(e);
  }
});

router.patch('/me', requireAuth(), async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(2).optional(),
      phone: z.string().optional(),
      city: z.string().optional(),
      address: z.string().optional(),
      avatar: z.string().url().optional(),
    });
    const body = schema.parse(req.body);

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: body },
      { new: true }
    ).select('-password');

    res.json({ success: true, user: updated });
  } catch (e) {
    next(e);
  }
});

// Admin: list users
router.get('/', requireAuth(), requireAdmin(), async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, users });
});

// Admin: block/unblock
router.patch('/:id/block', requireAuth(), requireAdmin(), async (req, res, next) => {
  try {
    const schema = z.object({ isBlocked: z.boolean() });
    const body = schema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, { $set: { isBlocked: body.isBlocked } }, { new: true })
      .select('-password');
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, user });
  } catch (e) {
    next(e);
  }
});

// Admin: set role
router.patch('/:id/role', requireAuth(), requireAdmin(), async (req, res, next) => {
  try {
    const schema = z.object({ role: z.enum(['user', 'admin']) });
    const body = schema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, { $set: { role: body.role } }, { new: true })
      .select('-password');
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, user });
  } catch (e) {
    next(e);
  }
});

// Admin: delete user
router.delete('/:id', requireAuth(), requireAdmin(), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;

