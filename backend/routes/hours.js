import express from 'express';
import HoursLog from '../models/HoursLog.js';
import User from '../models/User.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// POST /api/hours — volunteer logs hours
router.post('/', protect, async (req, res) => {
  try {
    const entry = new HoursLog({
      email: req.user.email,
      name: req.body.name,
      eventId: req.body.eventId,
      eventTitle: req.body.eventTitle,
      hours: req.body.hours,
      note: req.body.note || '',
    });
    await entry.save();

    // Update volunteer's total hours in User model
    await User.findByIdAndUpdate(req.user.id, { $inc: { totalHours: req.body.hours } });

    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/hours — user sees own, trustee sees all
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'Trustee' ? {} : { email: req.user.email };
    const logs = await HoursLog.find(filter).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
