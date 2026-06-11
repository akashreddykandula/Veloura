import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestEmail: String,
    customer: {
      name: String,
      email: String,
      phone: String
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        slug: String,
        image: String,
        sku: String,
        size: String,
        color: String,
        quantity: Number,
        price: Number
      }
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    pricing: {
      subtotal: Number,
      discount: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: Number
    },
    couponCode: String,
    payment: {
      method: { type: String, enum: ['razorpay', 'cod'], required: true },
      status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      failureReason: String
    },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'return-requested', 'returned'],
      default: 'placed'
    },
    tracking: [
      {
        status: String,
        note: String,
        location: String,
        at: { type: Date, default: Date.now }
      }
    ],
    returnRequest: {
      reason: String,
      status: { type: String, enum: ['none', 'requested', 'approved', 'rejected', 'received', 'refunded'], default: 'none' },
      requestedAt: Date
    },
    refund: {
      status: { type: String, enum: ['none', 'initiated', 'processing', 'completed', 'failed'], default: 'none' },
      amount: Number,
      reference: String
    }
  },
  { timestamps: true }
);

orderSchema.pre('save', function setOrderNumber(next) {
  if (!this.orderNumber) this.orderNumber = `VL${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;
  next();
});

export default mongoose.model('Order', orderSchema);
