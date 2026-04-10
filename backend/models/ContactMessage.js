import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);
