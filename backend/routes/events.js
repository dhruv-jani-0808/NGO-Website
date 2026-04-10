import express from 'express';
import Event from '../models/Event.js';
import protect from '../middleware/auth.js';
import { isTrustee } from '../middleware/roles.js';

const router = express.Router();

// GET /api/events — public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events — trustee only
router.post('/', protect, isTrustee, async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, registrations: [] });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/events/:id — trustee only
router.put('/:id', protect, isTrustee, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/events/:id — trustee only
router.delete('/:id', protect, isTrustee, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events/:id/register — volunteer registers
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.registrations.includes(req.user.email)) {
      return res.status(400).json({ message: 'Already registered' });
    }
    if (event.registrations.length >= event.slots) {
      return res.status(400).json({ message: 'Event is full' });
    }
    event.registrations.push(req.user.email);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/events/:id/register — volunteer unregisters
router.delete('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    event.registrations = event.registrations.filter(e => e !== req.user.email);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
