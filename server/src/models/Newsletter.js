import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    source: { type: String, default: 'website' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Newsletter', newsletterSchema);
