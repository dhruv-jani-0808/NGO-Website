import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Donor', 'Volunteer', 'Trustee', 'Staff'], default: 'Donor' },
    status: { type: String, enum: ['Active', 'Inactive', 'On Leave', 'Pending'], default: 'Active' },
    totalHours: { type: Number, default: 0 },
    joined: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
