📚 Coursewave – LMS Platform

Coursewave is a full-stack Learning Management System (LMS) built with **Next.js (frontend)**, **Node.js/Express (backend)**, **Supabase + Prisma (database & auth)**, and integrated services like **Stripe** and **SendGrid**.

The platform supports students, instructors, and admins with modules like user management, content management, subscriptions, and payments.

---

## 🚀 Project Structure
```
coursewave/
│── backend/ # Node.js + Express API (business logic, payments, DB access)
      │── prisma/ # Prisma schema & migrations
│── frontend/ # Next.js app (UI, dashboards, course pages)

```
---

## ⚙️ Tech Stack

- **Frontend:** Next.js (App Router), React, TailwindCSS
- **Backend:** Node.js, Express, Prisma ORM
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Supabase Auth (email + OAuth), JWT sessions
- **Payments:** Stripe (subscriptions, instructor payouts)
- **Emails:** SendGrid (welcome, notifications, password reset)
- **Storage:** Supabase Storage (course videos, files)
- **Deployment:** Vercel (frontend), AWS/Docker (backend)

---

## 🏗️ Features (MVP)

- 🔐 User Authentication (student, instructor, admin roles)
- 📚 Course Management (create, update, enroll, watch content)
- 💳 Subscription Payments (Stripe)
- 📩 Email Notifications (SendGrid)
- 📊 Instructor Dashboard (basic analytics, income view)

---

## 🖥️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/coursewave.git
cd coursewave
```

### 2. Setup Environment

Create a .env file in both backend/ and frontend/ with:

```bash
DATABASE_URL=your_supabase_postgres_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret
SENDGRID_API_KEY=your_sendgrid_api_key
JWT_SECRET=your_jwt_secret
```

3. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

4. Run the development servers
   Backend (Node.js + Express):

```bash
cd backend
npm run build && npm run start
```

Frontend (Next.js):

```bash
cd frontend
npm run dev
```

Open http://localhost:3000 for frontend.

Backend will run at http://localhost:5000 (or your configured port).

---

## 📦 Database & Migrations
Using Prisma + Supabase (Postgres).

```bash
npx prisma migrate dev
```

---

## 📌 Roadmap (Future Enhancements)

✅ Testing & Certifications (PDF generation)

✅ Real-time Community Chat (WebSockets or Firebase)

✅ Project Collaboration (file sharing, mentorship)

✅ Admin Dashboard (income reports, platform management)

✅ Instructor Payouts (Stripe Connect)

---

## 📜 License
MIT
