import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: String,
    size: String,
    color: String,
    quantity: { type: Number, default: 1, min: 1 },
    price: { type: Number, required: true }
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    guestId: { type: String, index: true },
    items: [cartItemSchema],
    coupon: { code: String, discount: Number },
    savedForLater: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
  },
  { timestamps: true }
);

export default mongoose.model('Cart', cartSchema);
