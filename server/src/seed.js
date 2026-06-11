import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';
import Banner from './models/Banner.js';

dotenv.config();
await connectDB();

await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({}), Coupon.deleteMany({}), Banner.deleteMany({})]);

const admin = await User.create({ name: 'Admin', email: 'admin@veloura.test', password: 'Admin1234', role: 'admin' });
await User.create({ name: 'Aarav Kapoor', email: 'customer@veloura.test', password: 'Customer1234', phone: '9999999999' });

const categories = await Category.insertMany([
  { name: 'Dresses', description: 'Elegant silhouettes for every occasion', isFeatured: true },
  { name: 'Shirts', description: 'Polished shirts and overshirts', isFeatured: true },
  { name: 'Denim', description: 'Premium denim essentials', isFeatured: true },
  { name: 'Outerwear', description: 'Layering pieces with quiet luxury', isFeatured: true },
  { name: 'Accessories', description: 'Finishing details for modern wardrobes' }
]);

const image = (seed) => ({
  url: `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=1200&q=85`,
  alt: 'Premium fashion editorial product'
});

const productData = [
  ['Satin Column Midi Dress', 'Dresses', 'women', 'limited-edition', 4890, 'Fluid satin midi dress with a sculpted neckline and soft drape.', ['XS', 'S', 'M', 'L'], ['Ivory', 'Black'], '1529137607769-1599'],
  ['Relaxed Linen Resort Shirt', 'Shirts', 'men', 'new-arrivals', 2490, 'Breathable linen shirt cut for relaxed summer tailoring.', ['S', 'M', 'L', 'XL'], ['Sage', 'White'], '1503342217505-b0a15ec3261c'],
  ['High Rise Straight Denim', 'Denim', 'women', 'best-sellers', 3290, 'Premium rigid denim with a flattering straight-leg profile.', ['26', '28', '30', '32'], ['Indigo'], '1542272604-787c3835535d'],
  ['Structured Wool Blend Coat', 'Outerwear', 'women', 'seasonal', 8990, 'Double-faced wool blend coat with a refined oversized fit.', ['S', 'M', 'L'], ['Camel', 'Charcoal'], '1483985988355-763728e1935b'],
  ['Textured Knit Polo', 'Shirts', 'men', 'trending', 2990, 'Fine-gauge knit polo with ribbed trims and a sharp collar.', ['S', 'M', 'L', 'XL'], ['Navy', 'Ecru'], '1516826957135-700dedea698c'],
  ['Vegan Leather Mini Skirt', 'Dresses', 'women', 'trending', 2190, 'A-line mini skirt with a soft vegan leather finish.', ['XS', 'S', 'M', 'L'], ['Black'], '1529139574466-a303027c1d8b'],
  ['Tapered Pleat Trousers', 'Denim', 'men', 'best-sellers', 3590, 'Tailored trousers with a relaxed taper and front pleats.', ['30', '32', '34', '36'], ['Stone', 'Black'], '1506629905607-d9e1b1e426b1'],
  ['Pearl Drop Earrings', 'Accessories', 'women', 'limited-edition', 1290, 'Freshwater pearl-inspired drops with gold-tone hardware.', ['OS'], ['Gold'], '1515562141207-7a88fb7ce338']
];

const categoryByName = Object.fromEntries(categories.map((category) => [category.name, category._id]));

await Product.insertMany(
  productData.map(([name, cat, gender, collectionType, price, description, sizes, colors, seed], index) => ({
    name,
    sku: `VL-${1000 + index}`,
    brand: index % 2 ? 'Veloura Atelier' : 'Veloura',
    category: categoryByName[cat],
    gender,
    collectionType,
    description,
    price,
    compareAtPrice: Math.round(price * 1.22),
    images: [image(seed), image(seed)],
    variants: sizes.flatMap((size) => colors.map((color, colorIndex) => ({ size, color: { name: color, hex: color === 'Black' ? '#111111' : color === 'White' ? '#ffffff' : '#c8b89b' }, sku: `VL-${1000 + index}-${size}-${colorIndex}`, stock: 8 + index + colorIndex }))),
    specifications: { fit: 'Regular fit', fabric: 'Premium blended fabric', care: 'Machine wash cold', origin: 'Responsibly made in India', occasion: 'Day to evening' },
    tags: [gender, collectionType, cat.toLowerCase()],
    isFeatured: index < 6,
    rating: 4.4 + (index % 5) / 10,
    reviewCount: 12 + index * 3,
    popularity: 80 - index * 4
  }))
);

await Coupon.create({ code: 'VEL10', type: 'percentage', value: 10, minOrderValue: 1499, maxDiscount: 750, isActive: true });
await Banner.create({
  title: 'The New Modern Wardrobe',
  subtitle: 'Tailored essentials, fluid textures, and pieces made to move beautifully.',
  ctaLabel: 'Shop New Arrivals',
  ctaUrl: '/shop?collection=new-arrivals',
  image: { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=85' },
  placement: 'home-hero',
  isActive: true
});

console.log(`Seeded Veloura data. Admin: ${admin.email} / Admin1234`);
process.exit(0);
