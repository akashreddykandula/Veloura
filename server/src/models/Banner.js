import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    ctaLabel: String,
    ctaUrl: String,
    image: { url: String, publicId: String },
    placement: { type: String, enum: ['home-hero', 'shop', 'flash-sale'], default: 'home-hero' },
    startsAt: Date,
    endsAt: Date,
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Banner', bannerSchema);
