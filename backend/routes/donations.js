import express from 'express';
import Donation from '../models/Donation.js';
import protect from '../middleware/auth.js';
import { isTrustee } from '../middleware/roles.js';

const router = express.Router();

// POST /api/donations — any logged-in user, creates a PENDING donation
router.post('/', protect, async (req, res) => {
  try {
    const donation = new Donation({
      donor: req.body.donor || req.user.name,
      email: req.body.email || req.user.email,
      amount: req.body.amount,
      cause: req.body.cause,
      upiId: req.body.upiId || '',
      status: 'pending',
    });
    await donation.save();
    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/donations — trustee sees all, user sees only their APPROVED donations
router.get('/', protect, async (req, res) => {
  try {
    let filter;
    if (req.user.role === 'Trustee') {
      filter = {}; // trustee sees everything including pending
    } else {
      filter = { email: req.user.email, status: 'approved' }; // users only see approved
    }
    const donations = await Donation.find(filter).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/donations/pending — trustee only, see all pending donations
router.get('/pending', protect, isTrustee, async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/donations/:id/approve — trustee approves, generates receiptNo
router.patch('/:id/approve', protect, isTrustee, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    // Generate receipt number
    const count = await Donation.countDocuments({ status: 'approved' });
    donation.receiptNo = `RCP-${String(count + 1).padStart(4, '0')}`;
    donation.status = 'approved';
    await donation.save();

    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/donations/:id/reject — trustee rejects
router.patch('/:id/reject', protect, isTrustee, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/donations/receipt/:receiptNo
router.get('/receipt/:receiptNo', protect, async (req, res) => {
  try {
    const donation = await Donation.findOne({ receiptNo: req.params.receiptNo });
    if (!donation) return res.status(404).json({ message: 'Receipt not found' });
    if (donation.email !== req.user.email && req.user.role !== 'Trustee') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
