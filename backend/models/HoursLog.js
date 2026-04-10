import mongoose from 'mongoose';

const hoursLogSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    eventId: { type: String, required: true },
    eventTitle: { type: String, required: true },
    hours: { type: Number, required: true },
    note: { type: String, default: '' },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  },
  { timestamps: true }
);

export default mongoose.model('HoursLog', hoursLogSchema);
