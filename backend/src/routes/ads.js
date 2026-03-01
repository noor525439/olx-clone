const express = require('express');
const { z } = require('zod');

const Ad = require('../models/Ad');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

function buildListQuery(q) {
  const filter = { status: { $ne: 'removed' }, isApproved: true };

  if (q.q) {
    filter.$text = { $search: String(q.q) };
  }
  if (q.city) filter.city = String(q.city);
  if (q.category) filter.category = String(q.category);

  const min = q.minPrice != null ? Number(q.minPrice) : null;
  const max = q.maxPrice != null ? Number(q.maxPrice) : null;
  if (Number.isFinite(min) || Number.isFinite(max)) {
    filter.price = {};
    if (Number.isFinite(min)) filter.price.$gte = min;
    if (Number.isFinite(max)) filter.price.$lte = max;
  }

  return filter;
}

function buildSort(sort) {
  switch (sort) {
    case 'price_asc':
      return { price: 1, createdAt: -1 };
    case 'price_desc':
      return { price: -1, createdAt: -1 };
    case 'popular':
      return { viewCount: -1, createdAt: -1 };
    default:
      return { createdAt: -1 };
  }
}

router.get('/', async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(40, Math.max(1, Number(req.query.limit || 12)));
  const skip = (page - 1) * limit;

  const filter = buildListQuery(req.query);
  const sort = buildSort(req.query.sort);

  const [items, total] = await Promise.all([
    Ad.find(filter).populate('seller', 'name city').sort(sort).skip(skip).limit(limit),
    Ad.countDocuments(filter),
  ]);

  res.json({
    success: true,
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  });
});

router.get('/mine', requireAuth(), async (req, res) => {
  const items = await Ad.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, items });
});

router.get('/admin/all', requireAuth(), requireAdmin(), async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.q) filter.$text = { $search: String(req.query.q) };
  if (req.query.city) filter.city = String(req.query.city);
  if (req.query.category) filter.category = String(req.query.category);
  if (req.query.status) filter.status = String(req.query.status);
  if (req.query.isApproved != null) filter.isApproved = String(req.query.isApproved) === 'true';

  const [items, total] = await Promise.all([
    Ad.find(filter).populate('seller', 'name email city').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Ad.countDocuments(filter),
  ]);

  res.json({ success: true, items, pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 } });
});

router.get('/:id', async (req, res, next) => {
  try {
    const ad = await Ad.findById(req.params.id).populate('seller', 'name phone city');
    if (!ad || ad.status === 'removed') {
      const err = new Error('Ad not found');
      err.statusCode = 404;
      throw err;
    }
    ad.viewCount = (ad.viewCount || 0) + 1;
    await ad.save();
    res.json({ success: true, item: ad });
  } catch (e) {
    next(e);
  }
});

router.post('/', requireAuth(), upload.array('images', 8), async (req, res, next) => {
  try {
    const schema = z.object({
      title: z.string().min(3),
      description: z.string().min(10),
      price: z.coerce.number().min(0),
      category: z.enum(['cars', 'mobiles', 'clothes', 'electronics', 'bikes', 'furniture', 'books', 'other']),
      location: z.string().min(2),
      city: z.string().min(2),
      stockQty: z.coerce.number().int().min(0).optional(),
    });
    const body = schema.parse(req.body);

    const images = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const ad = await Ad.create({
      ...body,
      images,
      seller: req.user._id,
      isApproved: true,
      status: 'active',
    });

    res.status(201).json({ success: true, item: ad });
  } catch (e) {
    next(e);
  }
});

router.patch('/:id', requireAuth(), upload.array('images', 8), async (req, res, next) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad || ad.status === 'removed') {
      const err = new Error('Ad not found');
      err.statusCode = 404;
      throw err;
    }
    const isOwner = ad.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      const err = new Error('Forbidden');
      err.statusCode = 403;
      throw err;
    }

    const schema = z.object({
      title: z.string().min(3).optional(),
      description: z.string().min(10).optional(),
      price: z.coerce.number().min(0).optional(),
      category: z.enum(['cars', 'mobiles', 'clothes', 'electronics', 'bikes', 'furniture', 'books', 'other']).optional(),
      location: z.string().min(2).optional(),
      city: z.string().min(2).optional(),
      status: z.enum(['active', 'sold', 'pending']).optional(),
      stockQty: z.coerce.number().int().min(0).optional(),
    });
    const body = schema.parse(req.body);

    const newImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
    const images = newImages.length ? [...(ad.images || []), ...newImages] : ad.images;

    Object.assign(ad, body, { images });
    await ad.save();

    res.json({ success: true, item: ad });
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', requireAuth(), async (req, res, next) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad || ad.status === 'removed') return res.json({ success: true });

    const isOwner = ad.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      const err = new Error('Forbidden');
      err.statusCode = 403;
      throw err;
    }

    ad.status = 'removed';
    await ad.save();
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

// Admin moderation: approve/remove/pending
router.patch('/:id/moderate', requireAuth(), requireAdmin(), async (req, res, next) => {
  try {
    const schema = z.object({
      isApproved: z.boolean().optional(),
      status: z.enum(['active', 'pending', 'removed', 'sold']).optional(),
    });
    const body = schema.parse(req.body);

    const ad = await Ad.findByIdAndUpdate(req.params.id, { $set: body }, { new: true });
    if (!ad) {
      const err = new Error('Ad not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, item: ad });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

