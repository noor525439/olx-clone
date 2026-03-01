const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    ad: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },

    shipping: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
      city: { type: String, default: '' },
    },

    payment: {
      provider: { type: String, default: 'custom' },
      status: { type: String, enum: ['unpaid', 'pending', 'paid', 'failed'], default: 'unpaid' },
      reference: { type: String, default: '' },
      raw: { type: mongoose.Schema.Types.Mixed, default: null },
    },

    status: { type: String, enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

