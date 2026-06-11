import Product from '../models/Product.js';
import Category from '../models/Category.js';

export async function sitemap(req, res) {
  const base = process.env.CLIENT_URL || 'http://localhost:5173';
  const [products, categories] = await Promise.all([Product.find({ isActive: true }).select('slug updatedAt'), Category.find({}).select('slug updatedAt')]);
  const urls = [
    '',
    '/shop',
    '/about',
    '/contact',
    ...products.map((product) => `/product/${product.slug}`),
    ...categories.map((category) => `/category/${category.slug}`)
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map((url) => `<url><loc>${base}${url}</loc></url>`)
    .join('')}</urlset>`;
  res.type('application/xml').send(xml);
}
