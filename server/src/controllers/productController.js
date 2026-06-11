import Product from '../models/Product.js';
import Category from '../models/Category.js';

function buildProductQuery(query) {
  const filter = { isActive: true };
  if (query.category) filter.category = query.category;
  if (query.brand) filter.brand = { $in: String(query.brand).split(',') };
  if (query.gender) filter.gender = query.gender;
  if (query.collection) filter.collectionType = query.collection;
  if (query.color) filter['variants.color.name'] = { $in: String(query.color).split(',') };
  if (query.size) filter['variants.size'] = { $in: String(query.size).split(',') };
  if (query.rating) filter.rating = { $gte: Number(query.rating) };
  if (query.availability === 'in-stock') filter['variants.stock'] = { $gt: 0 };
  if (query.minPrice || query.maxPrice) filter.price = { ...(query.minPrice && { $gte: Number(query.minPrice) }), ...(query.maxPrice && { $lte: Number(query.maxPrice) }) };
  if (query.q) filter.$text = { $search: query.q };
  return filter;
}

function sortOption(sort) {
  return {
    newest: { createdAt: -1 },
    popularity: { popularity: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'best-rated': { rating: -1 }
  }[sort] || { createdAt: -1 };
}

export async function listProducts(req, res) {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 12), 60);
  const filter = buildProductQuery(req.query);
  const [items, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort(sortOption(req.query.sort)).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter)
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}

export async function getProduct(req, res) {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('category', 'name slug');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  product.popularity += 1;
  await product.save();
  const related = await Product.find({ category: product.category._id, _id: { $ne: product._id }, isActive: true }).limit(8);
  res.json({ product, related });
}

export async function createProduct(req, res) {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
}

export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  res.json({ message: 'Product archived', product });
}

export async function reviewProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  product.reviews = product.reviews.filter((review) => String(review.user) !== String(req.user._id));
  product.reviews.push({ user: req.user._id, name: req.user.name, rating: req.body.rating, title: req.body.title, comment: req.body.comment });
  await product.save();
  res.status(201).json(product);
}

export async function filters(req, res) {
  const [categories, products] = await Promise.all([
    Category.find({}).select('name slug'),
    Product.find({ isActive: true }).select('brand variants price rating')
  ]);
  res.json({
    categories,
    brands: [...new Set(products.map((product) => product.brand))],
    sizes: [...new Set(products.flatMap((product) => product.variants.map((variant) => variant.size)))],
    colors: [...new Set(products.flatMap((product) => product.variants.map((variant) => variant.color?.name).filter(Boolean)))],
    price: {
      min: Math.min(...products.map((product) => product.price), 0),
      max: Math.max(...products.map((product) => product.price), 0)
    }
  });
}
