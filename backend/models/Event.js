import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['drive', 'camp'], required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    slots: { type: Number, required: true },
    registrations: [{ type: String }], // array of emails
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
