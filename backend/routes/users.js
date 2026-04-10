import express from 'express';
import User from '../models/User.js';
import HoursLog from '../models/HoursLog.js';
import protect from '../middleware/auth.js';
import { isTrustee } from '../middleware/roles.js';

const router = express.Router();

// GET /api/users/volunteers — trustee only
router.get('/volunteers', protect, isTrustee, async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'Volunteer' }).select('-password');
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/staff — trustee only
router.get('/staff', protect, isTrustee, async (req, res) => {
  try {
    const staff = await User.find({ role: 'Staff' }).select('-password');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/:id — trustee updates volunteer/staff
router.put('/:id', protect, isTrustee, async (req, res) => {
  try {
    const { password, ...updates } = req.body; // never allow password update here
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/users/:id — trustee removes volunteer
router.delete('/:id', protect, isTrustee, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
