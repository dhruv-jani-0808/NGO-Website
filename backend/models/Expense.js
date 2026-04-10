import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: {
      type: String,
      enum: ['Food', 'Healthcare', 'Education', 'Operations', 'Transport', 'Other'],
      required: true,
    },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);
