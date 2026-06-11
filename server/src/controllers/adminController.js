import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import Banner from '../models/Banner.js';

export async function dashboard(req, res) {
  const [orders, revenue, products, customers, pendingOrders] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$pricing.total' } } }]),
    Product.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Order.countDocuments({ status: { $in: ['placed', 'confirmed', 'packed'] } })
  ]);
  const salesByDay = await Order.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$pricing.total' }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $limit: 30 }
  ]);
  res.json({ orders, revenue: revenue[0]?.total || 0, products, customers, pendingOrders, salesByDay });
}

export async function listCoupons(req, res) {
  res.json(await Coupon.find({}).sort({ createdAt: -1 }));
}

export async function saveCoupon(req, res) {
  const coupon = req.params.id
    ? await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    : await Coupon.create(req.body);
  res.status(req.params.id ? 200 : 201).json(coupon);
}

export async function deleteCoupon(req, res) {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: 'Coupon deleted' });
}

export async function listBanners(req, res) {
  res.json(await Banner.find({}).sort({ sortOrder: 1 }));
}

export async function saveBanner(req, res) {
  const banner = req.params.id
    ? await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    : await Banner.create(req.body);
  res.status(req.params.id ? 200 : 201).json(banner);
}

export async function reviewModeration(req, res) {
  const product = await Product.findById(req.params.productId);
  const review = product.reviews.id(req.params.reviewId);
  review.status = req.body.status;
  await product.save();
  res.json(product);
}
