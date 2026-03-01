const express = require('express');
const { z } = require('zod');

const Order = require('../models/Order');
const Ad = require('../models/Ad');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth(), async (req, res, next) => {
  try {
    const schema = z.object({
      items: z.array(
        z.object({
          adId: z.string().min(1),
          qty: z.coerce.number().int().min(1),
        })
      ).min(1),
      shipping: z.object({
        name: z.string().min(2),
        phone: z.string().min(7),
        address: z.string().min(5),
        city: z.string().min(2),
      }),
    });
    const body = schema.parse(req.body);

    const adIds = body.items.map((i) => i.adId);
    const ads = await Ad.find({ _id: { $in: adIds }, status: { $ne: 'removed' }, isApproved: true });
    const byId = new Map(ads.map((a) => [a._id.toString(), a]));

    const normalizedItems = body.items.map((i) => {
      const ad = byId.get(i.adId);
      if (!ad) {
        const err = new Error('Some items are not available');
        err.statusCode = 400;
        throw err;
      }
      if (ad.stockQty != null && ad.stockQty < i.qty) {
        const err = new Error(`Not enough stock for ${ad.title}`);
        err.statusCode = 400;
        throw err;
      }
      return {
        ad: ad._id,
        title: ad.title,
        price: ad.price,
        qty: i.qty,
        image: ad.images?.[0] || '',
      };
    });

    const subtotal = normalizedItems.reduce((sum, it) => sum + it.price * it.qty, 0);
    const deliveryFee = 0;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      user: req.user._id,
      items: normalizedItems,
      subtotal,
      deliveryFee,
      total,
      shipping: body.shipping,
      payment: { provider: 'custom', status: 'unpaid' },
      status: 'placed',
    });

    res.status(201).json({ success: true, order });
  } catch (e) {
    next(e);
  }
});

router.get('/mine', requireAuth(), async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

router.get('/', requireAuth(), requireAdmin(), async (_req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email city')
    .sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

router.get('/:id', requireAuth(), async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email city');
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    const isOwner = order.user?._id?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      const err = new Error('Forbidden');
      err.statusCode = 403;
      throw err;
    }
    res.json({ success: true, order });
  } catch (e) {
    next(e);
  }
});

router.patch('/:id/status', requireAuth(), requireAdmin(), async (req, res, next) => {
  try {
    const schema = z.object({
      status: z.enum(['placed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
      paymentStatus: z.enum(['unpaid', 'pending', 'paid', 'failed']).optional(),
    });
    const body = schema.parse(req.body);

    const update = {};
    if (body.status) update.status = body.status;
    if (body.paymentStatus) update['payment.status'] = body.paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, order });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

