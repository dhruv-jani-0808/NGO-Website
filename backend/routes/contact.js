import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import protect from '../middleware/auth.js';
import { isTrustee } from '../middleware/roles.js';

const router = express.Router();

// POST /api/contact — public
router.post('/', async (req, res) => {
  try {
    const msg = new ContactMessage(req.body);
    await msg.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/contact/messages — trustee only
router.get('/messages', protect, isTrustee, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
