import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    joined: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Staff', staffSchema);
