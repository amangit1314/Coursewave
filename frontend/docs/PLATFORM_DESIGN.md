# CourseWave Platform Design Document

## Overview
CourseWave is a full-stack Learning Management System (LMS) built as a SaaS platform. It enables instructors to create and sell courses, host live sessions, build communities, and track student progress.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Tremor (charts) |
| State | Zustand (13 stores) with SSR-safe persistence |
| Data Fetching | TanStack React Query v5 |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT (access + refresh), NextAuth (Google/GitHub OAuth) |
| Payments | Stripe Checkout + Webhooks |
| Real-time | Socket.io (chat, presence, typing indicators) |
| AI | Google Gemini (quiz gen, course descriptions, study notes, roadmaps) |
| File Storage | UploadThing, Supabase Storage |
| Video | Mux / direct upload with transcript processing |

## Architecture

```
course-app/
├── frontend/          # Next.js 15 App Router
│   ├── src/app/       # 76 pages across 5 route groups
│   │   ├── (auth)/    # Login, register, password reset, email verify
│   │   ├── (public)/  # Browse, courses, articles, projects, community
│   │   ├── (instructor)/ # Dashboard, course management, analytics
│   │   ├── (sessions)/   # Live session browsing, booking, video calls
│   │   └── (user)/       # Dashboard, learnings, cart, wishlist, profile
│   ├── src/hooks/     # 32 React Query hooks
│   ├── src/zustand/   # 13 Zustand stores
│   ├── src/lib/
│   │   ├── api/       # ApiManager + 20 service singletons
│   │   └── ai/        # Gemini client + 4 AI generators
│   └── src/types/     # TypeScript interfaces
└── backend/           # Express.js API
    └── src/
        ├── api/       # Route handlers (auth, courses, sessions, etc.)
        ├── config/    # DB, socket, env validation
        └── core/      # Services (notifications, enrollment)
```

## Feature Status

### Fully Working (API-Connected)
- User authentication (email + OAuth)
- Course browsing, detail, enrollment, payment
- Course content player with progress tracking
- Course creation with multi-step form + AI description generator
- Course editor (sections, chapters, drag-and-drop, video upload)
- Quiz editor with AI auto-generation
- Certificate generation (PDF)
- Article CRUD
- Project showcase
- Community chat (real-time with reactions, pins, replies)
- Learning dashboard with progress, goals, AI study notes
- Cart + Wishlist
- Instructor analytics dashboard (20+ chart components)
- Live sessions (browsing, booking, payment, Jitsi Meet)
- Instructor session management (wired to real API)
- Instructor profile management
- AI learning roadmaps
- Notification system (real-time)
- Subscription management (Stripe)

### Coming Soon (Frontend Ready, Needs Backend API)
- Instructor earnings tracking (needs `GET /instructor/earnings`)
- Student progress tracking (needs `GET /instructor/students`)
- Per-course enrollment list (needs `GET /courses/:id/enrollments`)
- Course feedback/reviews (instructor view)
- Community management (instructor admin)

## Data Flow

```
User Action → React Component → Zustand Store (local state)
                              → React Query Hook → API Service → Backend API
                              ← React Query Cache ← API Response
```

## Security Measures
1. JWT with refresh token rotation
2. OAuth sync with backend verification
3. Admin role protection (can't self-assign via registration)
4. Rate limiting on auth endpoints
5. XSS sanitization with DOMPurify
6. CORS restricted in production
7. Environment validation with Zod
8. Debug logging gated behind isDev flag

## Build Status
- TypeScript: Zero errors
- Next.js build: Compiles successfully (53 pages)
- All SSR/prerender issues resolved

## Future Roadmap
1. Backend earnings API + instructor payout system
2. Student analytics with aggregated progress data
3. Community management tools
4. Course review response capability
5. Per-course analytics (chapter-level completion)
6. Mobile responsive instructor dashboard
