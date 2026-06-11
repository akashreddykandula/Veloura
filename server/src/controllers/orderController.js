import crypto from 'crypto';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { razorpay } from '../config/razorpay.js';
import { buildInvoice } from '../utils/invoice.js';

function calc(items, discount = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 2999 ? 0 : 149;
  const tax = Math.round((subtotal - discount) * 0.05);
  return { subtotal, discount, shipping, tax, total: Math.max(subtotal - discount + shipping + tax, 0) };
}

export async function createOrder(req, res) {
  const cart = await Cart.findOne(req.user ? { user: req.user._id } : { guestId: req.body.guestId }).populate('items.product');
  if (!cart || !cart.items.length) {
    res.status(400);
    throw new Error('Cart is empty');
  }
  const items = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    slug: item.product.slug,
    image: item.product.images[0]?.url,
    sku: item.product.sku,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    price: item.price
  }));
  const pricing = calc(items, cart.coupon?.discount || 0);
  const order = await Order.create({
    user: req.user?._id,
    guestEmail: req.body.customer?.email,
    customer: req.body.customer,
    items,
    shippingAddress: req.body.shippingAddress,
    pricing,
    couponCode: cart.coupon?.code,
    payment: { method: req.body.paymentMethod, status: req.body.paymentMethod === 'cod' ? 'pending' : 'pending' },
    tracking: [{ status: 'placed', note: 'Order placed successfully' }]
  });
  if (req.body.paymentMethod === 'razorpay') {
    const paymentOrder = await razorpay.orders.create({ amount: pricing.total * 100, currency: 'INR', receipt: order.orderNumber });
    order.payment.razorpayOrderId = paymentOrder.id;
    await order.save();
  }
  await Cart.findByIdAndUpdate(cart._id, { items: [], coupon: undefined });
  res.status(201).json(order);
}

export async function verifyPayment(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret').update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  const order = await Order.findOne({ 'payment.razorpayOrderId': razorpay_order_id });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (expected !== razorpay_signature) {
    order.payment.status = 'failed';
    order.payment.failureReason = 'Signature verification failed';
    await order.save();
    res.status(400);
    throw new Error('Payment verification failed');
  }
  order.payment.status = 'paid';
  order.payment.razorpayPaymentId = razorpay_payment_id;
  order.payment.razorpaySignature = razorpay_signature;
  order.status = 'confirmed';
  order.tracking.push({ status: 'confirmed', note: 'Payment received and order confirmed' });
  await order.save();
  res.json(order);
}

export async function myOrders(req, res) {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
}

export async function getOrder(req, res) {
  const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
  const order = await Order.findOne(filter);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(order);
}

export async function cancelOrder(req, res) {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order || !['placed', 'confirmed'].includes(order.status)) {
    res.status(400);
    throw new Error('Order cannot be cancelled');
  }
  order.status = 'cancelled';
  order.tracking.push({ status: 'cancelled', note: req.body.reason || 'Cancelled by customer' });
  await order.save();
  res.json(order);
}

export async function requestReturn(req, res) {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order || order.status !== 'delivered') {
    res.status(400);
    throw new Error('Only delivered orders can be returned');
  }
  order.status = 'return-requested';
  order.returnRequest = { reason: req.body.reason, status: 'requested', requestedAt: new Date() };
  await order.save();
  res.json(order);
}

export async function invoice(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${order.orderNumber}.pdf"`);
  res.send(buildInvoice(order));
}

export async function adminOrders(req, res) {
  res.json(await Order.find({}).sort({ createdAt: -1 }).limit(200));
}

export async function updateOrderStatus(req, res) {
  const order = await Order.findById(req.params.id);
  order.status = req.body.status;
  order.tracking.push({ status: req.body.status, note: req.body.note, location: req.body.location });
  await order.save();
  res.json(order);
}

export async function inventoryReport(req, res) {
  const products = await Product.find({}).select('name sku variants price');
  res.json(products.map((product) => ({ id: product._id, name: product.name, sku: product.sku, stock: product.variants.reduce((sum, variant) => sum + variant.stock, 0), value: product.price })));
}
