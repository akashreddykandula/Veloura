import mongoose from 'mongoose';
import slugify from 'slugify';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: String,
    alt: String
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    color: { name: String, hex: String },
    sku: { type: String, required: true },
    stock: { type: Number, default: 0 },
    price: Number
  },
  { _id: true }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    title: String,
    comment: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    brand: { type: String, default: 'Veloura' },
    sku: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    gender: { type: String, enum: ['men', 'women', 'unisex'], default: 'unisex' },
    collectionType: { type: String, enum: ['new-arrivals', 'best-sellers', 'trending', 'limited-edition', 'seasonal'], default: 'new-arrivals' },
    description: { type: String, required: true },
    specifications: {
      fit: String,
      fabric: String,
      care: String,
      origin: String,
      occasion: String
    },
    price: { type: Number, required: true },
    compareAtPrice: Number,
    costPrice: Number,
    images: [imageSchema],
    variants: [variantSchema],
    tags: [String],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviews: [reviewSchema],
    popularity: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    seo: {
      title: String,
      description: String,
      keywords: [String]
    }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text', brand: 'text' });

productSchema.pre('save', function setDerived(next) {
  if (!this.slug || this.isModified('name')) this.slug = slugify(this.name, { lower: true, strict: true });
  const approved = this.reviews.filter((review) => review.status === 'approved');
  this.reviewCount = approved.length;
  this.rating = approved.length ? approved.reduce((sum, review) => sum + review.rating, 0) / approved.length : 0;
  next();
});

productSchema.virtual('stockStatus').get(function stockStatus() {
  const total = this.variants.reduce((sum, variant) => sum + variant.stock, 0);
  if (total <= 0) return 'Out of stock';
  if (total < 8) return 'Low stock';
  return 'In stock';
});

export default mongoose.model('Product', productSchema);
