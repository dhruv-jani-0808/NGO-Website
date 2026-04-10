import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'node:dns';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import donationRoutes from './routes/donations.js';
import expenseRoutes from './routes/expenses.js';
import hoursRoutes from './routes/hours.js';
import contactRoutes from './routes/contact.js';
import userRoutes from './routes/users.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/hours', hoursRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);

app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is running', database: 'Connected' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
