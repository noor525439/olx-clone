const express = require('express');
const axios = require('axios');
const { z } = require('zod');

const Order = require('../models/Order');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

function paymentClient() {
  const baseURL = process.env.PAYMENT_API_BASE_URL;
  const apiKey = process.env.PAYMENT_API_KEY;
  if (!baseURL || !apiKey) return null;
  return axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    timeout: 20000,
  });
}

router.post('/create', requireAuth(), async (req, res, next) => {
  try {
    const schema = z.object({ orderId: z.string().min(1) });
    const body = schema.parse(req.body);

    const order = await Order.findById(body.orderId).populate('user', 'name email phone');
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

    const client = paymentClient();
    if (!client) {
      // Fallback: mark pending and return a fake reference (for local dev)
      const reference = `DEV-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
      order.payment.status = 'pending';
      order.payment.reference = reference;
      order.payment.raw = { mode: 'dev' };
      await order.save();
      return res.json({ success: true, mode: 'dev', reference, redirectUrl: null });
    }

    const payload = {
      amount: order.total,
      currency: process.env.PAYMENT_CURRENCY || 'PKR',
      orderId: order._id.toString(),
      customer: {
        name: order.shipping?.name || order.user?.name || '',
        phone: order.shipping?.phone || order.user?.phone || '',
        email: order.user?.email || '',
      },
      callbackUrl: process.env.PAYMENT_CALLBACK_URL || '',
      webhookUrl: process.env.PAYMENT_WEBHOOK_URL || '',
    };

    const { data } = await client.post('/payments', payload);

    const reference = data.reference || data.id || data.paymentId || '';
    const redirectUrl = data.redirectUrl || data.url || data.paymentUrl || null;

    order.payment.provider = process.env.PAYMENT_PROVIDER || 'custom';
    order.payment.status = 'pending';
    order.payment.reference = reference;
    order.payment.raw = data;
    await order.save();

    res.json({ success: true, reference, redirectUrl, raw: data });
  } catch (e) {
    next(e);
  }
});

// Generic webhook: map reference/orderId + status to paid/failed
router.post('/webhook', async (req, res, next) => {
  try {
    const body = req.body || {};

    const orderId = body.orderId || body.order_id || body.metadata?.orderId;
    const reference = body.reference || body.ref || body.paymentId || body.id;
    const statusRaw = String(body.status || body.paymentStatus || '').toLowerCase();

    const status =
      ['paid', 'success', 'succeeded'].includes(statusRaw) ? 'paid'
        : ['failed', 'cancelled', 'canceled'].includes(statusRaw) ? 'failed'
          : 'pending';

    const order = orderId
      ? await Order.findById(orderId)
      : reference
        ? await Order.findOne({ 'payment.reference': reference })
        : null;

    if (order) {
      order.payment.status = status;
      order.payment.raw = body;
      await order.save();
    }

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

// Admin helper: manually mark paid (for testing)
router.post('/mark-paid', requireAuth(), requireAdmin(), async (req, res, next) => {
  try {
    const schema = z.object({ orderId: z.string().min(1) });
    const body = schema.parse(req.body);
    const order = await Order.findById(body.orderId);
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    order.payment.status = 'paid';
    await order.save();
    res.json({ success: true, order });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

