import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
    priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
    replies: [
      {
        author: String,
        message: String,
        at: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('SupportTicket', ticketSchema);
