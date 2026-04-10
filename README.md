# NGO Anand — Full Stack Web Application

A complete web platform for NGO Anand, built with React + Vite (frontend) and Node.js + Express + MongoDB Atlas (backend).

---

## Tech Stack

**Frontend**
- React 18 + Vite
- React Router DOM
- Context API (Auth + AppData)

**Backend**
- Node.js + Express 5
- MongoDB Atlas + Mongoose
- bcryptjs (password hashing)
- JSON Web Tokens (JWT auth)

---

## Project Structure

```
├── src/                        # Frontend (React)
│   ├── context/
│   │   ├── AuthContext.jsx     # Auth state, login/logout, JWT
│   │   └── AppDataContext.jsx  # All API calls (events, donations, etc.)
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Blog.jsx
│   │   ├── Contact.jsx
│   │   ├── Donate.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── VolunteerDashboard.jsx
│   │   ├── TrusteeDashboard.jsx
│   │   └── NotFound.jsx
│   └── App.jsx
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Donation.js
│   │   ├── Expense.js
│   │   ├── HoursLog.js
│   │   └── ContactMessage.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── donations.js
│   │   ├── expenses.js
│   │   ├── hours.js
│   │   ├── contact.js
│   │   └── users.js
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   └── roles.js            # isTrustee, isVolunteer
│   ├── seed.js                 # Database seeder
│   ├── server.js
│   └── .env
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone <repo-url>
cd ngo-anand
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
NGO_SECRET_KEY=samaj seva e j prabhu seva
```

Seed the database:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

From the project root:

```bash
npm install
```

Create `.env` in the root:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

---

## Test Accounts (after seeding)

| Role      | Email                    | Password       |
|-----------|--------------------------|----------------|
| Trustee   | dhruv@ngoanand.org       | trustee123     |
| Volunteer | arjun.m@email.com        | volunteer123   |
| Staff     | meera@ngoanand.org       | staff123       |
| Donor     | priya@example.com        | donor123       |

---

## Features

### Public
- Home page with impact stats, cause cards, testimonials
- About page with team and values
- Blog / News & Events with gallery
- Contact form

### Authentication
- Login / Register with role selection (Donor, Volunteer, Trustee, Staff)
- Volunteer, Staff, Trustee require a secret key to register
- Restricted roles are created as **Pending** — trustee must approve before they can log in
- JWT-based sessions

### Donor
- Donate to causes (Food, Education, Healthcare, Disaster Relief)
- UPI QR code + UPI ID payment flow
- Donation submitted as **pending** — trustee verifies and approves
- Approved donations appear in Profile with printable receipts

### Volunteer Dashboard
- View upcoming events
- Register / unregister for events
- Log volunteer hours per event
- View personal hours history

### Trustee Dashboard
- Overview: total donations, expenses, net balance, volunteer/staff/event counts
- Volunteer management: edit name/email/status, remove
- Staff management: edit name/email/status, remove
- Event management: create, edit (upcoming & past)
- Donations: view all approved donations
- Expenses: add and track expenses by category
- Contact messages: inbox from the contact form
- **Signup Requests**: approve or reject pending Volunteer/Staff/Trustee registrations
- **Payment Requests**: verify UPI ID and approve or reject pending donations

---

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |
| GET | `/api/auth/signup-requests` | Trustee |
| PATCH | `/api/auth/signup-requests/:id/approve` | Trustee |
| PATCH | `/api/auth/signup-requests/:id/reject` | Trustee |
| GET | `/api/events` | Public |
| POST | `/api/events` | Trustee |
| PUT | `/api/events/:id` | Trustee |
| DELETE | `/api/events/:id` | Trustee |
| POST | `/api/events/:id/register` | Protected |
| DELETE | `/api/events/:id/register` | Protected |
| POST | `/api/donations` | Protected |
| GET | `/api/donations` | Protected |
| GET | `/api/donations/pending` | Trustee |
| PATCH | `/api/donations/:id/approve` | Trustee |
| PATCH | `/api/donations/:id/reject` | Trustee |
| GET | `/api/expenses` | Trustee |
| POST | `/api/expenses` | Trustee |
| POST | `/api/hours` | Protected |
| GET | `/api/hours` | Protected |
| POST | `/api/contact` | Public |
| GET | `/api/contact/messages` | Trustee |
| GET | `/api/users/volunteers` | Trustee |
| GET | `/api/users/staff` | Trustee |
| PUT | `/api/users/:id` | Trustee |
| DELETE | `/api/users/:id` | Trustee |
