import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import protect from '../middleware/auth.js';
import { isTrustee } from '../middleware/roles.js';

const router = express.Router();
const RESTRICTED_ROLES = ['Volunteer', 'Trustee', 'Staff'];
const SECRET_KEY = process.env.NGO_SECRET_KEY || 'samaj seva e j prabhu seva';

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role, secretKey } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  const isRestricted = RESTRICTED_ROLES.includes(role);

  if (isRestricted) {
    if (!secretKey || secretKey !== SECRET_KEY) {
      return res.status(403).json({ message: 'Invalid secret key for this role' });
    }
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);

    // Restricted roles start as Pending — need trustee approval
    const status = isRestricted ? 'Pending' : 'Active';
    const user = await User.create({ name, email, password: hashed, role: role || 'Donor', status });

    if (isRestricted) {
      // Return a special response — no token, just a pending message
      return res.status(201).json({ pending: true, message: 'Request submitted. Awaiting trustee approval.' });
    }

    res.status(201).json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // Block pending users from logging in
    if (user.status === 'Pending') {
      return res.status(403).json({
        pending: true,
        message: 'Your account is pending approval by the trustee.',
      });
    }

    res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/auth/signup-requests — trustee only, see all pending users
router.get('/signup-requests', protect, isTrustee, async (req, res) => {
  try {
    const requests = await User.find({ status: 'Pending' }).select('-password').sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/auth/signup-requests/:id/approve — trustee approves
router.patch('/signup-requests/:id/approve', protect, isTrustee, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'Active' }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/auth/signup-requests/:id/reject — trustee rejects (deletes the user)
router.patch('/signup-requests/:id/reject', protect, isTrustee, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request rejected and user removed.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
