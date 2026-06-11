import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, index: true },
    description: String,
    image: { url: String, publicId: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    isFeatured: { type: Boolean, default: false },
    seo: {
      title: String,
      description: String,
      keywords: [String]
    }
  },
  { timestamps: true }
);

categorySchema.pre('save', function setSlug(next) {
  if (!this.slug || this.isModified('name')) this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

export default mongoose.model('Category', categorySchema);
