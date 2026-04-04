---
name: Coursewave LMS Overview
description: Full-stack LMS app - Next.js 15 frontend, Express/Prisma backend, Supabase/Postgres DB, Stripe payments
type: project
---

**Coursewave** is a Learning Management System with three roles: Student, Instructor, Admin.

**Frontend** (`frontend/`): Next.js 15 (App Router, Turbopack), React 18, TypeScript, TailwindCSS, shadcn/ui, Zustand + React Query, Stripe, Socket.IO, Stream Chat/Video. Runs on port 3000.

**Backend** (`backend/`): Express 5, TypeScript, Prisma ORM + PostgreSQL (Supabase), JWT auth, Redis caching, RabbitMQ, Socket.IO, SendGrid email, Stripe webhooks, Prometheus monitoring, Winston logging. Runs on port 5000.

**Run:** `npm run dev` in each directory. Backend needs `.env` with DATABASE_URL, JWT secrets, Stripe/SendGrid keys. Frontend needs `.env.local` with NEXT_PUBLIC_API_URL.

**Why:** Active MVP in development with many features in progress (tracked in `docs/remaining.md`).

**How to apply:** Check `docs/remaining.md` for current feature status before suggesting new work. Use Prisma schema as source of truth for data model.
