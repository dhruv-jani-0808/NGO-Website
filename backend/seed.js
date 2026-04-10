import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dns from 'node:dns';
import User from './models/User.js';
import Event from './models/Event.js';
import Donation from './models/Donation.js';
import Expense from './models/Expense.js';
import ContactMessage from './models/ContactMessage.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const EVENTS = [
  { title: 'Food Distribution Drive', type: 'drive', date: '2026-04-20', time: '9:00 AM – 1:00 PM', location: 'Station Road, Anand', description: 'Monthly food distribution for underprivileged families.', slots: 20, registrations: [] },
  { title: 'Free Health Camp', type: 'camp', date: '2026-04-27', time: '10:00 AM – 4:00 PM', location: 'Community Hall, Vallabh Vidyanagar', description: 'Free general health check-up, BP, sugar screening.', slots: 15, registrations: [] },
  { title: 'Back-to-School Supply Drive', type: 'drive', date: '2026-05-05', time: '8:00 AM – 12:00 PM', location: 'Anand Primary School', description: 'Distribute books, bags, and stationery to 200+ students.', slots: 25, registrations: [] },
  { title: 'Women Empowerment Workshop', type: 'camp', date: '2026-05-15', time: '2:00 PM – 5:00 PM', location: 'NGO Anand Office', description: 'Skill development and awareness session for women.', slots: 10, registrations: [] },
  { title: 'Winter Blanket Drive', type: 'drive', date: '2025-12-20', time: '8:00 PM – 11:00 PM', location: 'Railway Station', description: 'Distributed 200 blankets.', slots: 15, registrations: [] },
  { title: 'Free Eye Checkup Camp', type: 'camp', date: '2025-11-15', time: '10:00 AM – 3:00 PM', location: 'Civil Hospital', description: 'Screened 150+ elderly patients.', slots: 20, registrations: [] },
  { title: 'Diwali Sweets Sharing', type: 'drive', date: '2025-10-22', time: '4:00 PM – 7:00 PM', location: 'Slum Areas, Anand', description: 'Sweets for children.', slots: 12, registrations: [] },
  { title: 'Blood Donation Camp', type: 'camp', date: '2025-08-10', time: '9:00 AM – 2:00 PM', location: 'Red Cross Society', description: 'Collected 75 units.', slots: 10, registrations: [] },
  { title: 'Monsoon Umbrella Drive', type: 'drive', date: '2025-07-05', time: '11:00 AM – 1:00 PM', location: 'Bus Stand', description: 'Gave umbrellas and raincoats to street vendors.', slots: 15, registrations: [] },
  { title: 'Mental Health Workshop', type: 'camp', date: '2025-06-18', time: '3:00 PM – 5:00 PM', location: 'Town Hall', description: 'Stress management and counseling.', slots: 8, registrations: [] },
  { title: 'Summer Hydration Camp', type: 'camp', date: '2025-05-12', time: '12:00 PM – 4:00 PM', location: 'Amul Dairy Road', description: 'Distributed buttermilk and ORS.', slots: 20, registrations: [] },
  { title: 'Old Clothes Collection', type: 'drive', date: '2025-04-02', time: '9:00 AM – 5:00 PM', location: 'NGO Office', description: 'Collected 500+ items of clothing.', slots: 10, registrations: [] },
  { title: 'Dental Screening Camp', type: 'camp', date: '2025-03-20', time: '9:00 AM – 1:00 PM', location: 'Primary School', description: 'Free checkups for kids.', slots: 12, registrations: [] },
  { title: 'Grocery Distribution', type: 'drive', date: '2025-01-26', time: '10:00 AM – 12:00 PM', location: 'Station Road', description: 'Monthly ration kits distributed.', slots: 15, registrations: [] },
  { title: 'Orphanage Visit', type: 'camp', date: '2024-12-25', time: '4:00 PM – 7:00 PM', location: 'Anand Orphanage', description: 'Games and dinner with kids.', slots: 25, registrations: [] },
];

const EXPENSES = [
  { description: 'Food supplies – April Drive', amount: 18000, date: '2026-04-05', category: 'Food' },
  { description: 'Medical kits – Health Camp', amount: 22000, date: '2026-03-28', category: 'Healthcare' },
  { description: 'School supplies – March Drive', amount: 15500, date: '2026-03-15', category: 'Education' },
  { description: 'Office rent – Q1', amount: 12000, date: '2026-03-01', category: 'Operations' },
];

const CONTACT_MSGS = [
  { name: 'Priya Patel', email: 'priya@example.com', subject: 'Volunteer Opportunities', message: 'I would love to volunteer during weekends. Please let me know how to join.', date: '2026-04-07' },
  { name: 'Karan Joshi', email: 'karan@biz.com', subject: 'Partnership Proposal', message: 'Our company would like to sponsor the upcoming health camp.', date: '2026-04-06' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Event.deleteMany({}),
    Donation.deleteMany({}),
    Expense.deleteMany({}),
    ContactMessage.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  const hash = (pw) => bcrypt.hash(pw, 12);
  const volPass = await hash('volunteer123');
  const staffPass = await hash('staff123');

  await Promise.all([
    // Trustee
    User.create({ name: 'Dhruv Jani', email: 'dhruv@ngoanand.org', password: await hash('trustee123'), role: 'Trustee', status: 'Active', joined: '2010-06-01', totalHours: 0 }),

    // Volunteers (14)
    User.create({ name: 'Arjun Mehta',   email: 'arjun.m@email.com',   password: volPass, role: 'Volunteer', status: 'Active', joined: '2024-05-10', totalHours: 42 }),
    User.create({ name: 'Sunita Desai',  email: 'sunita.d@email.com',  password: volPass, role: 'Volunteer', status: 'Active', joined: '2024-08-14', totalHours: 36 }),
    User.create({ name: 'Rahul Shah',    email: 'rahul.s@email.com',   password: volPass, role: 'Volunteer', status: 'Active', joined: '2025-01-02', totalHours: 18 }),
    User.create({ name: 'Riya Patel',    email: 'riya.p@email.com',    password: volPass, role: 'Volunteer', status: 'Active', joined: '2023-11-20', totalHours: 55 }),
    User.create({ name: 'Vikram Singh',  email: 'vikram.s@email.com',  password: volPass, role: 'Volunteer', status: 'Active', joined: '2025-02-15', totalHours: 12 }),
    User.create({ name: 'Neha Gupta',    email: 'neha.g@email.com',    password: volPass, role: 'Volunteer', status: 'Active', joined: '2024-12-05', totalHours: 25 }),
    User.create({ name: 'Kunal Joshi',   email: 'kunal.j@email.com',   password: volPass, role: 'Volunteer', status: 'Active', joined: '2025-03-10', totalHours: 8  }),
    User.create({ name: 'Pooja Trivedi', email: 'pooja.t@email.com',   password: volPass, role: 'Volunteer', status: 'Active', joined: '2023-09-01', totalHours: 60 }),
    User.create({ name: 'Amit Chawla',   email: 'amit.c@email.com',    password: volPass, role: 'Volunteer', status: 'Active', joined: '2024-10-18', totalHours: 14 }),
    User.create({ name: 'Sneha Rao',     email: 'sneha.r@email.com',   password: volPass, role: 'Volunteer', status: 'Active', joined: '2024-07-22', totalHours: 30 }),
    User.create({ name: 'Manoj Tiwari',  email: 'manoj.t@email.com',   password: volPass, role: 'Volunteer', status: 'Active', joined: '2024-03-30', totalHours: 45 }),
    User.create({ name: 'Kavita Verma',  email: 'kavita.v@email.com',  password: volPass, role: 'Volunteer', status: 'Active', joined: '2024-09-09', totalHours: 22 }),
    User.create({ name: 'Anjali Nair',   email: 'anjali.n@email.com',  password: volPass, role: 'Volunteer', status: 'Active', joined: '2024-01-15', totalHours: 50 }),
    User.create({ name: 'Sanjay Dutt',   email: 'sanjay.d@email.com',  password: volPass, role: 'Volunteer', status: 'Active', joined: '2025-03-20', totalHours: 10 }),

    // Staff (4)
    User.create({ name: 'Meera Patel',    email: 'meera@ngoanand.org',         password: staffPass, role: 'Staff', status: 'Active', joined: '2022-03-15', totalHours: 0 }),
    User.create({ name: 'Rajan Solanki',  email: 'rajan@ngoanand.org',         password: staffPass, role: 'Staff', status: 'Active', joined: '2023-07-10', totalHours: 0 }),
    User.create({ name: 'Priya Shah',     email: 'priya.shah@ngoanand.org',    password: staffPass, role: 'Staff', status: 'Active', joined: '2023-11-01', totalHours: 0 }),
    User.create({ name: 'Kiran Desai',    email: 'kiran@ngoanand.org',         password: staffPass, role: 'Staff', status: 'Active', joined: '2024-02-20', totalHours: 0 }),

    // Donor
    User.create({ name: 'Priya Patel', email: 'priya@example.com', password: await hash('donor123'), role: 'Donor', status: 'Active', joined: '2026-01-15', totalHours: 0 }),
  ]);
  console.log('Users created (1 trustee, 14 volunteers, 4 staff, 1 donor)');

  await Event.insertMany(EVENTS);
  console.log('Events created');

  await Donation.insertMany([
    { donor: 'Arjun Mehta', email: 'arjun.m@email.com', amount: 500,  cause: 'Food Distribution', receiptNo: 'RCP-0001', date: '2026-03-10', status: 'approved', upiId: 'arjun@paytm'    },
    { donor: 'Priya Patel', email: 'priya@example.com', amount: 1000, cause: 'Education Fund',    receiptNo: 'RCP-0002', date: '2026-03-22', status: 'approved', upiId: 'priya@gpay'     },
    { donor: 'Karan Joshi', email: 'karan@biz.com',     amount: 2500, cause: 'Healthcare Drive',  receiptNo: 'RCP-0003', date: '2026-04-01', status: 'approved', upiId: 'karan@phonepe'  },
  ]);
  console.log('Donations created');

  await Expense.insertMany(EXPENSES);
  console.log('Expenses created');

  await ContactMessage.insertMany(CONTACT_MSGS);
  console.log('Contact messages created');

  console.log('\n✅ Seed complete!');
  console.log('─────────────────────────────────────────────');
  console.log('Test Accounts:');
  console.log('  Trustee  → dhruv@ngoanand.org      / trustee123');
  console.log('  Volunteer→ arjun.m@email.com        / volunteer123');
  console.log('  Staff    → dhruvil@ngoanand.org     / staff123');
  console.log('  Donor    → priya@example.com        / donor123');
  console.log('─────────────────────────────────────────────');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
