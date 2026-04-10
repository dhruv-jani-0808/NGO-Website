import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donor: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    cause: { type: String, required: true },
    upiId: { type: String, default: '' },
    receiptNo: { type: String, unique: true, sparse: true },
    paymentMethod: { type: String, default: 'UPI' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  },
  { timestamps: true }
);

export default mongoose.model('Donation', donationSchema);
