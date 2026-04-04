# CourseWave — Master Task Tracker

## Legend
- [x] Done
- [~] In progress / partially done
- [ ] Not started

---

## Phase 0: Security & Stability Fixes

### Security
- [x] Remove ADMIN from registration schema — `auth.schemas.ts`
- [x] Remove hardcoded JWT fallback secrets — `auth.service.ts`, `jwt.ts`, `tokenService.ts`, `secure-auth.service.ts`
- [x] Restore admin auth on getAllUsers/getUserById — `users.service.ts`
- [x] Delete hardcoded Redis credential — `redis.ts` (deleted)
- [x] Sanitize XSS via DOMPurify — `DynamicContentSection.tsx`
- [x] Gate debug logging behind isDev — `api-manager.ts`
- [x] Move API URL to env var — `NEXT_PUBLIC_API_URL`
- [x] Add auth rate limiting — `auth.routes.ts`
- [x] Restrict Socket.IO CORS — `socket.ts`
- [x] Add verifyToken to chapter creation route — `courses.routes.ts`

### Stability
- [x] SSR-safe Zustand stores — `safe-storage.ts` on all 10 stores
- [x] Fix useLocalStorage hydration mismatch
- [x] Guard navigator.language in currencyStore
- [x] Consolidate 17 PrismaClient to singleton
- [x] Remove force-dynamic from root layout
- [x] Remove global * transition CSS rule
- [x] Fix duplicate CSS keyframes
- [x] Remove duplicate slow-route middleware
- [x] Delete 18 dead files
- [x] Fix Node 25 SlowBuffer polyfill
- [x] Fix dotenv loading order (moved to top)
- [x] Fix tsconfig for ts-node type augmentation

---

## Phase 1: Core LMS Feature Fixes

### Course Flow
- [x] Wire video player onComplete → updateChapterProgress
- [x] Fix free course enrollment (frontend threw on success)
- [x] Add search/filter/sort to GET /courses (?search, ?categoryId, ?isFree, ?sortBy)
- [x] Auto-aggregate Course.averageRating on review CRUD
- [ ] Add "mark chapter complete" button for text/quiz content (not just video)
- [ ] Total duration calculation per course/chapter
- [ ] Free video playback only for unenrolled users
- [ ] Course level display on detail page

### Notifications
- [x] Create notificationService.ts
- [x] Fire on: free enrollment, paid enrollment, course completion, new review
- [ ] Fire on: project feedback received
- [ ] Fire on: community @mentions
- [ ] Fire on: instructor course published
- [ ] Implement email channel (currently only in-app)
- [ ] Successfully enrolled notification (from old fixes.txt #11)

### Cart & Payments
- [x] Restore cart page (API hooks version)
- [x] Fix cart page syntax errors
- [ ] Cart checkout → Stripe end-to-end verification
- [ ] Coupon code validation (UI exists, backend endpoint needed)
- [ ] Verify Stripe webhook signature in production
- [ ] Add wishlisted item to cart button

### Progress & Certificates
- [x] Uncomment LearningHeader with progress bar
- [x] Fix LearningHeader duplicate imports
- [x] Build certificate page (completion check, branded PDF, print)
- [ ] Backend certificate endpoint with verification URL
- [ ] Certificate model in Prisma schema
- [ ] "Share on LinkedIn" button on certificate page

### Reviews
- [x] Rating auto-aggregation on create/edit/delete
- [ ] Write review UI on course detail page
- [ ] Edit/delete review UI
- [ ] Optimistic update for review cache
- [ ] Rating distribution display on course page

---

## Phase 2: Feature Implementation

### Google/GitHub OAuth
- [x] OAuthAccount model + User.password optional
- [x] oauth.service.ts + POST /api/auth/oauth route
- [x] NextAuth route (Google + GitHub)
- [x] useOAuthSync hook + SessionProvider
- [x] Login buttons (Google + GitHub)
- [x] Guard loginUser against OAuth users
- [ ] Run `npx prisma migrate dev --name add-oauth-accounts`
- [ ] Set env vars: NEXTAUTH_SECRET, GOOGLE_*, GITHUB_*
- [ ] Test OAuth end-to-end
- [ ] Add OAuth buttons to register page

### Community Chat
- [x] Edit/delete message events
- [x] Toggle reactions + full state broadcast
- [x] Disconnect cleanup (offline status)
- [x] Error handling on all handlers
- [x] Rewrite store with proper types
- [x] Fix all chat components (MessageInput, MessageCard, ChatMessages, etc.)
- [ ] File upload to cloud storage (currently blob URLs)
- [ ] Message search
- [ ] WebRTC voice/video channels

### Landing Page
- [x] New hero section (Framer Motion, no GSAP)
- [x] New testimonials section
- [x] New CTA section
- [x] Unified theme tokens (brand colors)
- [x] Clean about/offerings/stats/browse sections

---

## Phase 3: Page-by-Page Status

### Public Pages
- [x] `/` — Landing (redesigned)
- [x] `/browse` — Course discovery (search, sort, price filter)
- [x] `/courses/[id]` — Course detail
- [x] `/courses/[id]/courseContent` — Content viewer
- [x] `/courses/[id]/certificate` — Certificate (built)
- [x] `/subscriptions` — Pricing
- [x] `/subscriptions/success` — Success (built)
- [x] `/subscriptions/cancle` — Cancel (built)
- [x] `/communityChat/[id]` — Chat room (fixed)
- [x] `/legal/*` — All 5 legal pages verified working
- [~] `/articles` — Full system exists, needs verification of: like status, follow/unfollow author, article rating, comment edit/delete
- [~] `/projects` — CRUD exists, needs: search, category filter, submission form enrollment check
- [~] `/roadmaps` — AI generation exists, needs verification
- [~] `/communityChat` — Community listing, needs verification
- [~] `/instructors` — 7-line stub, needs building
- [~] `/instructors/[id]` — 8-line stub (profile, articles, courses, projects, sessions)
- [~] `/authors` — Needs verification
- [~] `/feedback` — Commented out, needs uncomment
- [~] `/feature-request` — Commented out, needs uncomment
- [~] `/helpAndSupport` — Needs verification

### Auth Pages
- [x] `/login` — Working with OAuth
- [~] `/register` — Needs OAuth buttons
- [~] `/forgot-password` — Needs verification
- [~] `/reset-password` — Needs verification (check invalid token handling)
- [~] `/verify-email` — Needs verification (check invalid token handling)

### User Pages
- [x] `/dashboard` — Enrolled courses, stats, activity, goals
- [x] `/dashboard/notifications` — Full CRUD
- [x] `/cart` — Restored
- [x] `/learnings/[courseId]` — Working with progress
- [x] `/writeArticle` — Cleaned up (working EditorJS)
- [~] `/profile` — Needs verification (change password dialog not closing on success)
- [~] `/settings` — Needs verification
- [~] `/wishlist` — Needs verification

### Instructor Pages
- [~] `/instructor/courses` — List view working
- [~] `/instructor/courses/create` — Has form, needs: price/prerequisites/status not saving (from fixes.txt #4)
- [~] `/instructor/courses/[id]` — Needs verification
- [~] `/instructor/courses/[id]/edit` — Wrapper, needs verification
- [ ] `/instructor/courses/[id]/enrollements` — 7-line stub
- [ ] `/instructor/courses/[id]/feedback` — 7-line stub
- [~] `/instructor/analytics` — Needs real data instead of placeholders (from fixes.txt #2)
- [~] `/instructor/earnings` — Needs verification + detailed earnings endpoints
- [ ] `/instructor/profile` — 7-line stub
- [~] `/instructor/projects` — Full components, needs verification
- [~] `/instructor/sessions` — Commented out
- [~] `/instructor/students` — Needs verification
- [~] `/instructor/settings` — Needs verification
- [~] `/instructor/communities` — Needs verification
- [~] `/instructor/articles` — Needs: listing, create → /writeArticle, edit, delete with dialog

### Session Pages
- [~] `/browseSessions` — Needs verification
- [x] `/browseSessions/[id]` — Dynamic with real API data, links to payment/schedule/meet
- [x] `/browseSessions/[id]/payment` — Full payment flow (free + paid via Stripe)
- [x] `/browseSessions/[id]/schedule` — Calendar date picker + time slot selection + booking
- [x] `/browseSessions/[id]/meet` — Jitsi Meet integration with pre-join lobby, live iframe, leave flow
- [~] `/bookSession` — Needs verification
- [~] `/pastSessions` — Needs verification
- [~] `/upcomingSessions` — Needs verification

---

## Phase 4: Launch Strategy

### Monetization (Weeks 1-3)
- [ ] Define and seed subscription plans with Stripe price IDs
- [ ] Enforce tier-based access in canAccessCourse middleware
- [ ] Verify purchase flow end-to-end
- [ ] Backend certificate verification endpoint

### Retention (Weeks 4-6)
- [ ] Email drip campaigns (welcome, progress stall, completion)
- [ ] Learning analytics dashboard (streaks, time spent)
- [ ] Course-scoped Q&A (community per course)

### Growth (Weeks 7-9)
- [ ] Referral system (codes, tracking, rewards)
- [ ] Project showcase gallery (public portfolio, upvotes)
- [ ] LinkedIn certificate sharing

### Differentiation (Weeks 10-14)
- [ ] Quiz engine (multiple choice, auto-graded)
- [ ] Project milestones and rubrics
- [ ] Instructor payout automation (Stripe Connect)

---

## Known Bugs (from old fixes.txt + remaining.md)

### High Priority
- [ ] Data/session clears after 15min, user must re-login (fixes.txt #3)
- [x] Course create: price(0), status(DRAFT), prerequisites, etc. not saving (fixes.txt #4) — fixed: added isFree/discount/dealPrice/level to create+update, validation for title/desc/price
- [ ] Instructor analytics shows placeholder data, not real (fixes.txt #2)
- [ ] Delete article doesn't refresh list (needs cache invalidation)
- [ ] Article like: can like multiple times in detail view (should toggle)
- [ ] Article like filled state not showing in detail view
- [ ] Change password dialog not closing on success

### Medium Priority
- [ ] Article views count not updating
- [ ] Author profile page: follow/unfollow, report, articles, courses
- [ ] Article rating system (stars, form, can't rate twice)
- [ ] Comment edit/delete/like on articles
- [ ] Course detail header conflicts on mobile (back button + logo + title)
- [ ] Course content: free preview only for unenrolled users
- [ ] Enrollment search/filter/pagination on dashboard
- [ ] Learning activity chart: wrong data, colors, dark mode issues
- [ ] Instructor subscription management

### Low Priority (UX Polish)
- [ ] Cursor pointer on: publish button, send email, save changes, learning goal checkbox, apply coupon
- [ ] Hover color changes: back to articles link → blue
- [ ] Loading shimmer improvements for articles, cart, wishlist, article details
- [ ] Show more/less from author on article page
- [ ] Newsletter signup (not implemented)
- [ ] Introduction video in landing about section

---

## Backend Debt

- [ ] Replace 275 console.* with Winston logger
- [ ] Use asyncHandler in all controllers (DRY error handling)
- [ ] Consolidate ServiceResponse interface to src/types
- [ ] Remove duplicate auth module (auth/ vs secure-auth/)
- [ ] Add pagination to getAllBlogs
- [ ] Extend Express.Request type for course/chapter/section/instructor
- [ ] Remove disabled checkAccessToken middleware
- [ ] Remove commented-out Redis/RabbitMQ code
- [ ] Rename communitites.controller.ts (typo)
- [ ] Implement TokenService.checkRateLimit (no-op)
- [ ] Populate InstructorEarning records
- [ ] Remove duplicate mapStripeStatus function
- [ ] Remove test /api/your-form-route endpoint
- [ ] Gate webhook console.log behind isDev

## Frontend Debt

- [ ] Remove mega store.ts (duplicates individual stores)
- [ ] Consolidate duplicate useMobile hooks
- [ ] Consolidate duplicate useAuthor hooks
- [ ] Consolidate jwt-helper.ts vs token-helper.ts
- [ ] Fix PaginatedResponse empty object type
- [ ] Replace Math.random() with crypto.randomUUID() in cart store
- [ ] Fix double rate limiting in api-manager
- [ ] Fix non-null assertions on optional prices in cart store
- [ ] Replace raw fetch() in store.ts with apiManager
- [ ] Fix `error: String` → `string` in store.ts
- [ ] Fix removeFromWishList no-op in store.ts
- [ ] Remove unused BellRing/X imports in notificationsStore
- [ ] Fix isReaded → isRead typo in notificationsStore

---

## Instructor Analytics Checklist (Detailed)

### Phase 1: Core
- [ ] Revenue trend chart (monthly, by course, date range selector)
- [ ] Course performance matrix (earnings, students, rating, completion per course)
- [ ] Payment status overview (completed vs pending, history)
- [ ] Student progress overview (avg completion, active vs inactive)
- [ ] New students this month + growth trend

### Phase 2: Engagement
- [ ] Chapter completion rates + drop-off points
- [ ] Rating distribution per course + trends
- [ ] Student notes density per course
- [ ] Project submission rates
- [ ] Live session attendance rates

### Phase 3: Advanced
- [ ] Student cohort analysis + retention curves
- [ ] Revenue forecasting (30-90 days)
- [ ] At-risk student identification
- [ ] AI-powered content improvement suggestions

### Backend APIs Needed
- [ ] GET /api/instructor/earnings (detailed)
- [ ] GET /api/instructor/earnings/courses
- [ ] GET /api/instructor/earnings/timeline
- [ ] GET /api/instructor/students/progress
- [ ] GET /api/instructor/students/engagement
- [ ] GET /api/instructor/courses/performance
- [ ] GET /api/instructor/ratings/distribution
