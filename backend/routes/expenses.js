import express from 'express';
import Expense from '../models/Expense.js';
import protect from '../middleware/auth.js';
import { isTrustee } from '../middleware/roles.js';

const router = express.Router();

// GET /api/expenses — trustee only
router.get('/', protect, isTrustee, async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/expenses — trustee only
router.post('/', protect, isTrustee, async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/expenses/:id — trustee only
router.delete('/:id', protect, isTrustee, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
