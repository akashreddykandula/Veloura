import Category from '../models/Category.js';
import Product from '../models/Product.js';

export async function listCategories(req, res) {
  res.json(await Category.find({}).sort('name'));
}

export async function getCategory(req, res) {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  const products = await Product.find({ category: category._id, isActive: true }).limit(24);
  res.json({ category, products });
}

export async function upsertCategory(req, res) {
  const category = req.params.id
    ? await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    : await Category.create(req.body);
  res.status(req.params.id ? 200 : 201).json(category);
}

export async function deleteCategory(req, res) {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted' });
}
