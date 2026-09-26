# BuildSkillForge

> **Build Skills. Build Projects. Build Your Future.**

BuildSkillForge is a full-stack web platform connecting ambitious college students across India with local businesses for verified, real-world digital and technology contracts.

Students:
`Learn → Compete → Prove → Build → Earn → Get Hired`

Businesses:
`Post Requirement → Discover Talent → Verify Skills → Select Student → Manage Project → Approve Work → Rate Student`

---

## 1. Architecture Overview

BuildSkillForge employs a modern full-stack decoupled architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                 REACT / VITE SPA FRONTEND                   │
│   Tailwind CSS · Framer Motion · Lucide Icons · Recharts    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / REST / Bearer JWT
┌──────────────────────────────▼──────────────────────────────┐
│                    NODE.JS + EXPRESS API                    │
│   Auth Middleware · Role Checks (STUDENT / BUSINESS / ADMIN)│
│   Payment Escrow (10% Platform Fee) · Storage Abstraction   │
│   ForgeAI Multilingual Intelligence (Google GenAI Gemini)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM / In-Memory Sync
┌──────────────────────────────▼──────────────────────────────┐
│              MONGODB ATLAS / DATA REPOSITORY                │
│   Users · Passports · Projects · Competitions · Reviews     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Lucide React, Canvas Confetti
- **Backend**: Node.js, Express.js REST API, Mongoose schemas, JWT Authentication, BCrypt password hashing
- **Database**: MongoDB Atlas (with built-in persistence fallback store pre-seeded with realistic Indian businesses)
- **AI Intelligence**: ForgeAI powered by Google Gemini (`@google/genai` with multilingual English/Hindi/Hinglish understanding)
- **Payments**: Milestone escrow service with flat **10% transparent platform fee** (e.g. ₹15,000 project = ₹1,500 fee + ₹13,500 student payout)

---

## 3. Seed / Demo Data

Realistic Indian enterprise seed data is included for evaluation:
- **Businesses**:
  - `Bean & Brew Café` (Specialty coffee roastery in Indiranagar/Koramangala · POS & Loyalty project)
  - `UrbanFit Gym` (Boutique fitness club in Mumbai · Workout booking portal)
  - `Glow Salon` (Luxury styling salon · Online calendar scheduler)
  - `BrightPath Coaching` (Entrance coaching institute · Quiz & doubt forum)
  - `SpiceRoute Restaurant` (Heritage dining · QR code table ordering system)
- **Collegiate Builders**:
  - `Aarav Sharma` (IIT Delhi · Skill Score 92/100 · Active contractor on Bean & Brew)
  - `Priya Patel` (VIT Vellore · Skill Score 94/100 · 1st Place National AI Grand Prix)
  - `Rohan Verma` (BITS Pilani · Cybersecurity specialist)
- **Fast Persona Switcher**:
  - Easily switch between Aarav (Student), Priya (Student), Bean & Brew (Business), UrbanFit (Business), and Admin Forge directly via the header or login screen!

---

## 4. Environment Configuration

Copy `.env.example` to `.env`:

```bash
# GEMINI AI (ForgeAI assistant)
GEMINI_API_KEY="your-gemini-api-key"

# DATABASE
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/buildskillforge?retryWrites=true&w=majority"

# AUTHENTICATION
JWT_SECRET="your-super-secure-jwt-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# PAYMENTS & STORAGE
PAYMENT_KEY_ID="rzp_test_samplekey123"
PAYMENT_KEY_SECRET="sample_payment_secret"
STORAGE_BUCKET="buildskillforge-deliverables"
STORAGE_REGION="ap-south-1"

# CLIENT
VITE_API_URL="/api"
PORT=3000
```

---

## 5. Development & Production Commands

```bash
# Install dependencies
npm install

# Start full-stack dev server (Express server with Vite middleware on port 3000)
npm run dev

# Build production bundle
npm run build

# Start production server
npm start

# Run TypeScript linter
npm run lint
```

---

## 6. REST API Endpoints

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/demo-login`, `GET /api/auth/me`
- **Projects**: `GET /api/projects`, `POST /api/projects`, `GET /api/projects/:id`, `POST /api/projects/:id/apply`, `POST /api/projects/:id/select-student`
- **Workspace**: `GET /api/workspace/:projectId`, `POST /api/workspace/:projectId/milestones/:milestoneId`, `POST /api/workspace/:projectId/messages`, `POST /api/workspace/:projectId/complete-and-rate`
- **Competitions**: `GET /api/competitions`, `GET /api/competitions/leaderboard`, `POST /api/competitions/:id/submit`
- **Skill Passports**: `GET /api/skill-passports/:studentId`, `GET /api/talent`, `PUT /api/talent/profile`
- **Payments**: `GET /api/payments/history`, `POST /api/payments/create-order`
- **Notifications**: `GET /api/notifications`, `PATCH /api/notifications/:id/read`
- **Support**: `GET /api/support`, `POST /api/support`, `PATCH /api/support/:id`
- **ForgeAI**: `POST /api/ai/ask`
- **Admin**: `GET /api/admin/stats`, `PATCH /api/admin/users/:id/status`

---

## 7. Security Hardening

- Password hashing using `bcryptjs` with salt rounds = 10.
- Bearer JWT token verification on all protected endpoints.
- Role-based authorization (`STUDENT`, `BUSINESS`, `ADMIN`) enforced on the backend.
- Milestone payments released strictly through server-side verified actions.
- AI assistant prompts routed strictly via backend proxy with safety boundaries against money transfers or role elevation.
