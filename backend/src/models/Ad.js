const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['cars', 'mobiles', 'clothes', 'electronics', 'bikes', 'furniture', 'books', 'other'],
    },
    location: { type: String, required: true },
    city: { type: String, required: true },
    images: [{ type: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'sold', 'removed', 'pending'], default: 'active' },
    isApproved: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },

    // Ecommerce-ish fields (optional)
    stockQty: { type: Number, default: 1, min: 0 },
  },
  { timestamps: true }
);

adSchema.index({ title: 'text', description: 'text' });
adSchema.index({ category: 1, city: 1, price: 1 });

module.exports = mongoose.model('Ad', adSchema);

