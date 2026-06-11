import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

async function getCartDocument(req) {
  const key = req.user ? { user: req.user._id } : { guestId: req.headers['x-guest-id'] || req.body.guestId || req.query.guestId };
  if (!key.user && !key.guestId) {
    key.guestId = `guest-${Date.now()}`;
  }
  let cart = await Cart.findOne(key).populate('items.product savedForLater');
  if (!cart) cart = await Cart.create(key);
  return cart.populate('items.product savedForLater');
}

export async function getCart(req, res) {
  res.json(await getCartDocument(req));
}

export async function addToCart(req, res) {
  const product = await Product.findById(req.body.productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const cart = await getCartDocument(req);
  const match = cart.items.find((item) => String(item.product._id) === String(product._id) && item.size === req.body.size && item.color === req.body.color);
  if (match) match.quantity += Number(req.body.quantity || 1);
  else cart.items.push({ product: product._id, variantId: req.body.variantId, size: req.body.size, color: req.body.color, quantity: req.body.quantity || 1, price: product.price });
  await cart.save();
  res.status(201).json(await cart.populate('items.product savedForLater'));
}

export async function updateCartItem(req, res) {
  const cart = await getCartDocument(req);
  const item = cart.items.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }
  item.quantity = req.body.quantity;
  await cart.save();
  res.json(await cart.populate('items.product savedForLater'));
}

export async function removeCartItem(req, res) {
  const cart = await getCartDocument(req);
  cart.items.pull(req.params.itemId);
  await cart.save();
  res.json(await cart.populate('items.product savedForLater'));
}

export async function saveForLater(req, res) {
  const cart = await getCartDocument(req);
  const item = cart.items.id(req.params.itemId);
  if (item) {
    cart.savedForLater.addToSet(item.product);
    cart.items.pull(req.params.itemId);
    await cart.save();
  }
  res.json(await cart.populate('items.product savedForLater'));
}

export async function applyCoupon(req, res) {
  const cart = await getCartDocument(req);
  const coupon = await Coupon.findOne({ code: String(req.body.code).toUpperCase(), isActive: true });
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (!coupon || (coupon.expiresAt && coupon.expiresAt < new Date()) || subtotal < coupon.minOrderValue) {
    res.status(400);
    throw new Error('Coupon is invalid for this cart');
  }
  const raw = coupon.type === 'percentage' ? (subtotal * coupon.value) / 100 : coupon.value;
  cart.coupon = { code: coupon.code, discount: Math.min(raw, coupon.maxDiscount || raw) };
  await cart.save();
  res.json(await cart.populate('items.product savedForLater'));
}
