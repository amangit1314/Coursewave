# CourseWave LMS Completion Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete CourseWave LMS — every page is a working feature with real API integration, no mock data, no stubs, all bugs fixed, code quality polished.

**Architecture:** Express + Prisma backend with Next.js 14 App Router frontend. Backend follows MVC (routes → controllers → services → Prisma). Frontend uses React Query hooks + Zustand stores + shadcn/ui components.

**Tech Stack:** TypeScript, Next.js 14, Express, Prisma, PostgreSQL (Supabase), Stripe, SendGrid, Redis, Framer Motion, Zustand, React Query, shadcn/ui

---

## Phase 1: Backend API Completion

### Task 1: Add Community Message Sending Endpoint

**Files:**
- Modify: `backend/src/api/communities/communities.routes.ts`
- Modify: `backend/src/api/communities/communities.controller.ts`
- Modify: `backend/src/api/communities/communities.service.ts`

- [ ] **Step 1: Add sendMessage method to communities service**

In `communities.service.ts`, add:

```typescript
static async sendMessage(communityId: string, userId: string, content: string, replyToId?: string) {
  const member = await prisma.communityMember.findFirst({
    where: { communityId, userId },
  });
  if (!member) throw new AppError("You must be a member to send messages", 403);

  const message = await prisma.message.create({
    data: {
      content,
      communityId,
      senderId: userId,
      ...(replyToId && { replyToId }),
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      replyTo: { include: { sender: { select: { id: true, name: true } } } },
    },
  });
  return message;
}
```

- [ ] **Step 2: Add controller method**

In `communities.controller.ts`, add:

```typescript
static sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { communityId } = req.params;
  const { content, replyToId } = req.body;
  const userId = req.user!.id;

  if (!content?.trim()) {
    return sendValidationError(res, "Message content is required");
  }

  const message = await CommunitiesService.sendMessage(communityId, userId, content.trim(), replyToId);
  sendSuccess(res, message, "Message sent", 201);
});
```

- [ ] **Step 3: Add route**

In `communities.routes.ts`, add after the GET messages route:

```typescript
router.post("/:communityId/messages", authenticate, CommunitiesController.sendMessage);
```

- [ ] **Step 4: Add leave community endpoint**

In `communities.service.ts`, add:

```typescript
static async leaveCommunity(communityId: string, userId: string) {
  const member = await prisma.communityMember.findFirst({
    where: { communityId, userId },
  });
  if (!member) throw new AppError("You are not a member of this community", 400);

  await prisma.communityMember.delete({ where: { id: member.id } });
  return { message: "Left community successfully" };
}
```

In `communities.controller.ts`:

```typescript
static leaveCommunity = asyncHandler(async (req: Request, res: Response) => {
  const { communityId } = req.params;
  const userId = req.user!.id;
  const result = await CommunitiesService.leaveCommunity(communityId, userId);
  sendSuccess(res, result, "Left community");
});
```

In `communities.routes.ts`:

```typescript
router.post("/:communityId/leave", authenticate, CommunitiesController.leaveCommunity);
```

- [ ] **Step 5: Build and verify**

Run: `cd backend && npm run build`
Expected: No TypeScript errors

- [ ] **Step 6: Commit**

```bash
git add backend/src/api/communities/
git commit -m "feat(backend): add community message sending and leave endpoints"
```

---

### Task 2: Add Feedback & Feature Request Endpoints

**Files:**
- Modify: `backend/src/api/contact/contact.routes.ts`
- Modify: `backend/src/api/contact/contact.controller.ts`
- Modify: `backend/src/api/contact/contact.service.ts`

These reuse the existing contact service pattern — submissions are emailed (no new Prisma models needed, keeping scope minimal).

- [ ] **Step 1: Add submitFeedback method to contact service**

In `contact.service.ts`, add:

```typescript
static async submitFeedback(data: {
  name: string;
  email: string;
  type: "bug" | "improvement" | "general";
  rating: number;
  message: string;
}) {
  const { name, email, type, rating, message } = data;

  await sendEmail({
    to: config.CONTACT_EMAIL || "gitaman8481@gmail.com",
    subject: `[Feedback - ${type}] from ${name}`,
    html: `
      <h2>User Feedback</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Type:</strong> ${type}</p>
      <p><strong>Rating:</strong> ${rating}/5</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });

  return { message: "Feedback submitted successfully" };
}

static async submitFeatureRequest(data: {
  name: string;
  email: string;
  title: string;
  category: string;
  description: string;
  priority: "low" | "medium" | "high";
}) {
  const { name, email, title, category, description, priority } = data;

  await sendEmail({
    to: config.CONTACT_EMAIL || "gitaman8481@gmail.com",
    subject: `[Feature Request - ${priority}] ${title}`,
    html: `
      <h2>Feature Request</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Priority:</strong> ${priority}</p>
      <p><strong>Description:</strong></p>
      <p>${description}</p>
    `,
  });

  return { message: "Feature request submitted successfully" };
}
```

- [ ] **Step 2: Add controller methods**

In `contact.controller.ts`, add:

```typescript
static submitFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, type, rating, message } = req.body;
  if (!name || !email || !message) {
    return sendValidationError(res, "Name, email, and message are required");
  }
  const result = await ContactService.submitFeedback({
    name, email, type: type || "general", rating: rating || 0, message,
  });
  sendSuccess(res, result, "Feedback submitted", 201);
});

static submitFeatureRequest = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, title, category, description, priority } = req.body;
  if (!name || !email || !title || !description) {
    return sendValidationError(res, "Name, email, title, and description are required");
  }
  const result = await ContactService.submitFeatureRequest({
    name, email, title, category: category || "general", description, priority: priority || "medium",
  });
  sendSuccess(res, result, "Feature request submitted", 201);
});
```

- [ ] **Step 3: Add routes**

In `contact.routes.ts`, add:

```typescript
router.post("/feedback", ContactController.submitFeedback);
router.post("/feature-request", ContactController.submitFeatureRequest);
```

- [ ] **Step 4: Build and verify**

Run: `cd backend && npm run build`
Expected: No TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add backend/src/api/contact/
git commit -m "feat(backend): add feedback and feature request submission endpoints"
```

---

### Task 3: Add Instructor Reviews Endpoint

**Files:**
- Modify: `backend/src/api/instructor/instructor.routes.ts`
- Modify: `backend/src/api/instructor/instructor.controller.ts`
- Modify: `backend/src/api/instructor/instructor.service.ts`

- [ ] **Step 1: Add getMyReviews method to instructor service**

In `instructor.service.ts`, add:

```typescript
static async getMyReviews(instructorId: string) {
  const courses = await prisma.course.findMany({
    where: { instructorId },
    select: { id: true, title: true, slug: true },
  });

  const courseIds = courses.map((c) => c.id);

  const reviews = await prisma.review.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      user: { select: { id: true, name: true, image: true } },
      course: { select: { id: true, title: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return {
    reviews,
    totalReviews: reviews.length,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution: [5, 4, 3, 2, 1].map((star) => ({
      stars: star,
      count: reviews.filter((r) => r.rating === star).length,
    })),
  };
}
```

- [ ] **Step 2: Add controller and route**

In `instructor.controller.ts`:

```typescript
static getMyReviews = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const instructor = await prisma.instructor.findUnique({ where: { userId } });
  if (!instructor) return sendNotFound(res, "Instructor profile not found");
  const data = await InstructorService.getMyReviews(instructor.id);
  sendSuccess(res, data, "Reviews fetched");
});
```

In `instructor.routes.ts`:

```typescript
router.get("/me/reviews", authenticate, InstructorController.getMyReviews);
```

- [ ] **Step 3: Build and verify**

Run: `cd backend && npm run build`
Expected: No TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add backend/src/api/instructor/
git commit -m "feat(backend): add instructor reviews endpoint with rating distribution"
```

---

### Task 4: Fix Session Payment to Use Real Stripe Checkout

**Files:**
- Modify: `backend/src/api/sessions/sessions.service.ts`
- Modify: `backend/src/api/sessions/sessions.routes.ts`
- Modify: `backend/src/api/sessions/sessions.controller.ts`

- [ ] **Step 1: Check existing session payment flow**

Read session service to understand current `payForSession` and `bookSession` implementation. The backend likely already validates Stripe — the fix is primarily frontend (Task 12). Verify the backend has:
- `bookSession()` that creates a booking
- `payForSession()` that accepts paymentId

If backend already handles Stripe payment validation, skip to Task 12 (frontend fix).

- [ ] **Step 2: Add Stripe checkout session creation for sessions**

If not present in sessions service, add:

```typescript
static async createSessionCheckout(sessionId: string, userId: string) {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) throw new AppError("Session not found", 404);

  const booking = await prisma.sessionBooking.findFirst({
    where: { sessionId, userId, status: "PENDING" },
  });
  if (!booking) throw new AppError("No pending booking found", 400);

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: session.title, description: session.description || undefined },
        unit_amount: Math.round((session.price || 0) * 100),
      },
      quantity: 1,
    }],
    metadata: { sessionId, userId, bookingId: booking.id },
    success_url: `${config.FRONTEND_URL}/browseSessions/${sessionId}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.FRONTEND_URL}/browseSessions/${sessionId}/payment?canceled=true`,
  });

  return { checkoutUrl: checkoutSession.url, sessionId: checkoutSession.id };
}
```

- [ ] **Step 3: Add controller and route**

```typescript
// Controller
static createCheckout = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const userId = req.user!.id;
  const result = await SessionsService.createSessionCheckout(sessionId, userId);
  sendSuccess(res, result, "Checkout session created");
});

// Route
router.post("/:sessionId/checkout", authenticate, SessionsController.createCheckout);
```

- [ ] **Step 4: Build and verify**

Run: `cd backend && npm run build`

- [ ] **Step 5: Commit**

```bash
git add backend/src/api/sessions/
git commit -m "feat(backend): add Stripe checkout session creation for session payments"
```

---

## Phase 2: Frontend — Wire Every Page to Real APIs

### Task 5: Fix Route Typo `/subscriptions/cancle` → `/cancel`

**Files:**
- Rename: `frontend/src/app/(public)/subscriptions/cancle/` → `frontend/src/app/(public)/subscriptions/cancel/`

- [ ] **Step 1: Rename the directory**

```bash
cd frontend
mv src/app/\(public\)/subscriptions/cancle src/app/\(public\)/subscriptions/cancel
```

- [ ] **Step 2: Search and update all references**

```bash
grep -r "cancle" src/ --include="*.tsx" --include="*.ts" -l
```

Update any imports or links found from `/subscriptions/cancle` to `/subscriptions/cancel`.

- [ ] **Step 3: Verify build**

Run: `cd frontend && npm run build`

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix(frontend): rename /subscriptions/cancle to /cancel"
```

---

### Task 6: Wire Instructor Communities Page

**Files:**
- Rewrite: `frontend/src/app/(instructor)/instructor/communities/page.tsx`
- Create: `frontend/src/app/(instructor)/instructor/communities/_components/CommunityList.tsx`
- Create: `frontend/src/app/(instructor)/instructor/communities/_components/CreateCommunityDialog.tsx`
- Create: `frontend/src/app/(instructor)/instructor/communities/_components/CommunityChat.tsx`
- Modify: `frontend/src/hooks/useCommunities.ts` — add mutation hooks
- Modify: `frontend/src/lib/api/services/communitiesService.ts` — add sendMessage, getMessages

- [ ] **Step 1: Add missing service methods**

In `communitiesService.ts`, add:

```typescript
export const getMessages = async (communityId: string) => {
  const response = await api.get(`/communities/${communityId}/messages`);
  return response.data;
};

export const sendMessage = async (communityId: string, content: string, replyToId?: string) => {
  const response = await api.post(`/communities/${communityId}/messages`, { content, replyToId });
  return response.data;
};

export const leaveCommunity = async (communityId: string) => {
  const response = await api.post(`/communities/${communityId}/leave`);
  return response.data;
};
```

- [ ] **Step 2: Add hooks for mutations**

In `useCommunities.ts`, add:

```typescript
export const useCreateCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description: string; isPublic: boolean }) =>
      communitiesService.createCommunity(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["communities"] }),
  });
};

export const useJoinCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (communityId: string) => communitiesService.joinCommunity(communityId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["communities"] }),
  });
};

export const useLeaveCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (communityId: string) => communitiesService.leaveCommunity(communityId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["communities"] }),
  });
};

export const useCommunityMessages = (communityId: string) => {
  return useQuery({
    queryKey: ["community-messages", communityId],
    queryFn: () => communitiesService.getMessages(communityId),
    enabled: !!communityId,
  });
};

export const useSendMessage = (communityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string; replyToId?: string }) =>
      communitiesService.sendMessage(communityId, data.content, data.replyToId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["community-messages", communityId] }),
  });
};
```

- [ ] **Step 3: Build CommunityList component**

Create `_components/CommunityList.tsx` — lists communities with join/leave buttons, member count, uses `useCommunities()` hook.

- [ ] **Step 4: Build CreateCommunityDialog component**

Create `_components/CreateCommunityDialog.tsx` — Dialog with name, description, isPublic toggle. Uses `useCreateCommunity()`.

- [ ] **Step 5: Build CommunityChat component**

Create `_components/CommunityChat.tsx` — message list + input. Uses `useCommunityMessages()` and `useSendMessage()`. Uses the existing `useCommunityChatStore` for local state (typing indicators, reactions, etc.).

- [ ] **Step 6: Rewrite the communities page**

Replace `page.tsx` with real implementation that shows community list, create button, and selected community chat.

- [ ] **Step 7: Build and verify**

Run: `cd frontend && npm run build`

- [ ] **Step 8: Commit**

```bash
git add frontend/src/app/\(instructor\)/instructor/communities/ frontend/src/hooks/useCommunities.ts frontend/src/lib/api/services/communitiesService.ts
git commit -m "feat(frontend): implement instructor communities with real-time chat"
```

---

### Task 7: Wire Course Feedback Page for Instructors

**Files:**
- Rewrite: `frontend/src/app/(instructor)/instructor/courses/[courseId]/feedback/page.tsx`
- Modify: `frontend/src/hooks/useInstructor.ts` — add `useMyReviews()` hook

- [ ] **Step 1: Add useMyReviews hook**

In `useInstructor.ts`, add:

```typescript
export const useMyReviews = () => {
  return useQuery({
    queryKey: ["instructor", "reviews"],
    queryFn: () => instructorService.getMyReviews(),
  });
};
```

In `instructorService.ts`, add if not present:

```typescript
export const getMyReviews = async () => {
  const response = await api.get("/instructor/me/reviews");
  return response.data;
};
```

- [ ] **Step 2: Rewrite feedback page**

Replace the Coming Soon stub with a real page showing:
- Average rating with star distribution bar chart
- Review list with user avatar, rating, comment, date, course name
- Filter by course, sort by date/rating
- Paginated list

Use shadcn Card, Avatar, Badge, Select components. Use the existing StatCard for overview stats.

- [ ] **Step 3: Build and verify**

Run: `cd frontend && npm run build`

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/\(instructor\)/instructor/courses/\[courseId\]/feedback/ frontend/src/hooks/useInstructor.ts frontend/src/lib/api/services/instructorService.ts
git commit -m "feat(frontend): implement course feedback page with real review data"
```

---

### Task 8: Wire Feedback & Feature Request Forms to Real API

**Files:**
- Modify: `frontend/src/app/(public)/feedback/page.tsx`
- Modify: `frontend/src/app/(public)/feature-request/page.tsx`
- Create: `frontend/src/hooks/useFeedback.ts`
- Modify: `frontend/src/lib/api/services/contactService.ts`

- [ ] **Step 1: Add service methods**

In `contactService.ts`, add:

```typescript
export const submitFeedback = async (data: {
  name: string; email: string; type: string; rating: number; message: string;
}) => {
  const response = await api.post("/contact/feedback", data);
  return response.data;
};

export const submitFeatureRequest = async (data: {
  name: string; email: string; title: string; category: string; description: string; priority: string;
}) => {
  const response = await api.post("/contact/feature-request", data);
  return response.data;
};
```

- [ ] **Step 2: Add hooks**

Create `useFeedback.ts`:

```typescript
import { useMutation } from "@tanstack/react-query";
import { submitFeedback, submitFeatureRequest } from "@/lib/api/services/contactService";

export const useSubmitFeedback = () => {
  return useMutation({ mutationFn: submitFeedback });
};

export const useSubmitFeatureRequest = () => {
  return useMutation({ mutationFn: submitFeatureRequest });
};
```

- [ ] **Step 3: Wire feedback page**

Replace the `setTimeout` simulation in `feedback/page.tsx` with:

```typescript
const { mutate: submitFeedback, isPending } = useSubmitFeedback();

const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  submitFeedback(formData, {
    onSuccess: () => {
      toast.success("Feedback submitted successfully!");
      setSubmitted(true);
    },
    onError: (err) => toast.error(err.message || "Failed to submit feedback"),
  });
};
```

- [ ] **Step 4: Wire feature request page**

Same pattern — replace `setTimeout` with `useSubmitFeatureRequest()` mutation.

- [ ] **Step 5: Build and verify**

Run: `cd frontend && npm run build`

- [ ] **Step 6: Commit**

```bash
git add frontend/src/app/\(public\)/feedback/ frontend/src/app/\(public\)/feature-request/ frontend/src/hooks/useFeedback.ts frontend/src/lib/api/services/contactService.ts
git commit -m "feat(frontend): wire feedback and feature request forms to real API"
```

---

### Task 9: Replace Mock Data in Analytics with Real API

**Files:**
- Modify: `frontend/src/app/(instructor)/instructor/analytics/_components/Analytics.tsx`
- Modify: `frontend/src/app/(instructor)/instructor/analytics/page.tsx`

- [ ] **Step 1: Remove sampleCourses import from Analytics.tsx**

Replace the `import { sampleCourses } from "@/lib/mock/mockData"` and all hardcoded stats with data from `useMyInstructorAnlaytics()`.

The analytics page already uses `useMyInstructorAnlaytics()` — the issue is the `_components/Analytics.tsx` sub-component falls back to `sampleCourses` when data is undefined. Fix:

```typescript
// Remove: import { sampleCourses } from "@/lib/mock/mockData";
// Replace fallback: const courses = createdCourses || sampleCourses;
// With: const courses = createdCourses || [];
```

- [ ] **Step 2: Replace hardcoded analytics stats**

Remove all hardcoded numbers (totalEnrollments: 9, averageRating: 3.9, etc.) and use the real analytics data passed from the parent page via props or fetched directly.

- [ ] **Step 3: Remove hardcoded conversion funnel data**

Replace with real data or remove the section if backend doesn't provide conversion metrics.

- [ ] **Step 4: Build and verify**

Run: `cd frontend && npm run build`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/\(instructor\)/instructor/analytics/
git commit -m "fix(frontend): replace mock data in analytics with real API data"
```

---

### Task 10: Replace Mock Data in Authors Page

**Files:**
- Modify: `frontend/src/app/(public)/authors/page.tsx`

- [ ] **Step 1: Wire to real API**

The page has hardcoded `mockArticles`. Replace with `useAuthors()` hook which already exists and calls `authorsService.getAuthors()`.

```typescript
// Remove hardcoded mockArticles
// Add: const { data: authors, isLoading } = useAuthors();
```

- [ ] **Step 2: Build and verify**

Run: `cd frontend && npm run build`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\(public\)/authors/
git commit -m "fix(frontend): replace hardcoded mock data in authors page with real API"
```

---

### Task 11: Replace Mock Data in Roadmaps Page

**Files:**
- Modify: `frontend/src/app/(public)/roadmaps/page.tsx`

- [ ] **Step 1: Replace mock categories and popularSkills**

The roadmaps page imports `categories` and `popularSkills` from mockData. Replace:
- `categories` → use `useCategories()` hook (already exists, calls real API)
- `popularSkills` → either fetch from categories API or inline as static content (these are curated UI suggestions, not dynamic data — static is acceptable here)

```typescript
// Remove: import { categories, popularSkills } from "@/lib/mock/mockData";
// Add: const { data: categoriesData } = useCategories();
// Keep popularSkills as a local const (these are curated skill suggestions, not DB data)
const popularSkills = [
  { name: "React", icon: "⚛️" },
  { name: "Node.js", icon: "🟢" },
  // ... etc
];
```

- [ ] **Step 2: Build and verify**

Run: `cd frontend && npm run build`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\(public\)/roadmaps/
git commit -m "fix(frontend): replace mock categories with real API in roadmaps page"
```

---

### Task 12: Fix Session Payment — Real Stripe Checkout

**Files:**
- Modify: `frontend/src/app/(sessions)/browseSessions/[sessionId]/payment/page.tsx`
- Modify: `frontend/src/lib/api/services/sessionsService.ts`

- [ ] **Step 1: Add checkout service method**

In `sessionsService.ts`, add:

```typescript
export const createSessionCheckout = async (sessionId: string) => {
  const response = await api.post(`/sessions/${sessionId}/checkout`);
  return response.data;
};
```

- [ ] **Step 2: Replace simulated payment with real Stripe**

In the payment page, replace:

```typescript
// Remove: const simulatedPaymentId = `pay_sim_${Date.now()}`;
// Remove: await payForSession(sessionId, "STRIPE", simulatedPaymentId);

// Add:
const handlePayment = async () => {
  try {
    setProcessing(true);
    const { data } = await sessionsService.createSessionCheckout(sessionId);
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl; // Redirect to Stripe
    }
  } catch (error) {
    toast.error("Payment failed. Please try again.");
  } finally {
    setProcessing(false);
  }
};
```

- [ ] **Step 3: Handle success return**

Add success/canceled query param handling for when Stripe redirects back:

```typescript
const searchParams = useSearchParams();
const success = searchParams.get("success");
const canceled = searchParams.get("canceled");

useEffect(() => {
  if (success === "true") {
    toast.success("Payment successful! Session booked.");
    router.push(`/mySessions`);
  }
  if (canceled === "true") {
    toast.error("Payment was canceled.");
  }
}, [success, canceled]);
```

- [ ] **Step 4: Build and verify**

Run: `cd frontend && npm run build`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/\(sessions\)/browseSessions/ frontend/src/lib/api/services/sessionsService.ts
git commit -m "feat(frontend): replace simulated payment with real Stripe checkout"
```

---

### Task 13: Wire Instructor Store TODOs

**Files:**
- Modify: `frontend/src/zustand/instructorStore.ts`

- [ ] **Step 1: Uncomment and wire API calls**

Replace the TODO comments with real implementation:

```typescript
fetchInstructorInfo: async (instructorId: string) => {
  set({ instructorLoading: true, instructorError: null });
  try {
    const response = await instructorService.getInstructorById(instructorId);
    set({ instructor: response.data, instructorLoading: false });
  } catch (error: any) {
    set({ instructorError: error.message, instructorLoading: false });
  }
},

fetchInstructorCourses: async (instructorId: string) => {
  set({ instructorLoading: true });
  try {
    const response = await instructorService.getInstructorCourses(instructorId);
    set({ instructorCourses: response.data, instructorLoading: false });
  } catch (error: any) {
    set({ instructorError: error.message, instructorLoading: false });
  }
},
```

- [ ] **Step 2: Build and verify**

Run: `cd frontend && npm run build`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/zustand/instructorStore.ts
git commit -m "fix(frontend): wire instructor store to real API calls"
```

---

### Task 14: Fix Project Dropdown Menu

**Files:**
- Modify: `frontend/src/app/(instructor)/instructor/projects/_components/ProjectDropdownMenu.tsx`

- [ ] **Step 1: Replace mock project and console.log handlers**

Remove the hardcoded `mockProject` and wire to real props + API:

```typescript
// Component should receive real project data as props
interface ProjectDropdownMenuProps {
  project: { id: string; title: string; slug: string };
}

// Replace console.log handlers with real navigation and mutations:
const handleDelete = () => {
  deleteProject(project.id, {
    onSuccess: () => toast.success("Project deleted"),
  });
};

const handleViewProject = () => router.push(`/projects/${project.slug || project.id}`);
const handleEditProject = () => router.push(`/instructor/projects/${project.id}/edit`);
```

Use `useDeleteProject()` from existing `useProjects` hook.

- [ ] **Step 2: Build and verify**

Run: `cd frontend && npm run build`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\(instructor\)/instructor/projects/_components/
git commit -m "fix(frontend): wire project dropdown to real API actions"
```

---

### Task 15: Fix Profile Social Links

**Files:**
- Modify: `frontend/src/app/(user)/profile/page.tsx`

- [ ] **Step 1: Replace href="#" with real social links from user data**

The profile page shows social links with `href="#"`. Wire to the user's actual social links from their profile data:

```typescript
const socialLinks = user?.instructor?.socialLinks || {};

// Replace hardcoded links:
{socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">...</a>}
{socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">...</a>}
{socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">...</a>}
```

Only render social icons that have actual URLs. Hide ones without links.

- [ ] **Step 2: Build and verify**

Run: `cd frontend && npm run build`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\(user\)/profile/
git commit -m "fix(frontend): wire social links to real user profile data"
```

---

### Task 16: Fix Help & Support Contact Forms

**Files:**
- Modify: `frontend/src/app/(public)/helpAndSupport/page.tsx`
- Modify: `frontend/src/app/(instructor)/instructor/helpAndSupport/page.tsx`

- [ ] **Step 1: Wire public help form to useContact() hook**

The help page has a contact form. Use the existing `useContact()` hook:

```typescript
const { mutate: sendMessage, isPending } = useContact();

const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  sendMessage(formData, {
    onSuccess: () => toast.success("Message sent! We'll get back to you soon."),
    onError: () => toast.error("Failed to send message. Please try again."),
  });
};
```

Replace any hardcoded placeholder social links (`#`) with real links or remove them.

- [ ] **Step 2: Wire instructor help form similarly**

Same pattern for the instructor version.

- [ ] **Step 3: Build and verify**

Run: `cd frontend && npm run build`

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/\(public\)/helpAndSupport/ frontend/src/app/\(instructor\)/instructor/helpAndSupport/
git commit -m "fix(frontend): wire help & support forms to real contact API"
```

---

### Task 17: Remove Mock Data in Learning Content

**Files:**
- Modify: `frontend/src/app/(user)/learnings/[courseId]/_components/CourseContentInstructorCard.tsx`
- Modify: `frontend/src/app/(user)/learnings/[courseId]/_components/ShowChapters.tsx`

- [ ] **Step 1: Remove mock imports**

In `CourseContentInstructorCard.tsx`:
```typescript
// Remove: import { courseChapters, sampleText } from "@/lib/mock/mockData";
// Use real course data passed as props from the parent
```

In `ShowChapters.tsx`:
```typescript
// Remove commented mock import
// Ensure chapters come from real course data via props
```

- [ ] **Step 2: Build and verify**

Run: `cd frontend && npm run build`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\(user\)/learnings/
git commit -m "fix(frontend): remove mock data from learning content components"
```

---

### Task 18: Fix Cart Coupon System

**Files:**
- Modify: `frontend/src/app/(user)/cart/page.tsx`

- [ ] **Step 1: Remove client-side coupon validation**

The cart page has hardcoded `availableCoupons`. Since no backend coupon system exists, replace with a clean approach:

Option A (recommended): Remove the coupon input entirely — don't show a feature that doesn't work.
Option B: Keep the UI but show "Coupon system coming soon" when entered.

Go with Option A — remove the coupon section from the cart. This can be re-added when a backend coupon system is built.

- [ ] **Step 2: Build and verify**

Run: `cd frontend && npm run build`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\(user\)/cart/
git commit -m "fix(frontend): remove non-functional client-side coupon system from cart"
```

---

## Phase 3: Code Quality

### Task 19: Clean Up Console.logs and Debug Code

**Files:** Multiple frontend files

- [ ] **Step 1: Remove all debug console.logs**

```bash
# Find all files with console.log
grep -rn "console.log" frontend/src/app/ --include="*.tsx" --include="*.ts" -l
```

Remove console.log statements from:
- `CreateProjectForm.tsx`
- `CourseNavbar.tsx`
- `CourseContent.tsx`
- `ProjectTableItem.tsx`
- `projects/[id]/edit/page.tsx`
- `CourseContentInstructorCard.tsx`
- Any other files found

Keep `console.error` and `console.warn` if they're in catch blocks — those are useful.

- [ ] **Step 2: Build and verify**

Run: `cd frontend && npm run build`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/
git commit -m "fix(frontend): remove debug console.log statements"
```

---

### Task 20: Delete mockData.ts (after all references removed)

**Files:**
- Delete: `frontend/src/lib/mock/mockData.ts`
- Modify: `frontend/src/lib/utils/roadmap-utils.ts` — update template handling

- [ ] **Step 1: Verify no imports remain**

```bash
grep -rn "mockData" frontend/src/ --include="*.tsx" --include="*.ts"
```

If any remain, fix them first.

- [ ] **Step 2: Handle roadmap-utils.ts**

`roadmap-utils.ts` imports `roadmapTemplates` from mockData. These are static AI roadmap templates — move them to a dedicated config file:

```bash
mv frontend/src/lib/mock/mockData.ts → extract roadmapTemplates to frontend/src/lib/config/roadmap-templates.ts
```

Update `roadmap-utils.ts` import.

- [ ] **Step 3: Delete mockData.ts**

```bash
rm frontend/src/lib/mock/mockData.ts
```

- [ ] **Step 4: Build and verify**

Run: `cd frontend && npm run build`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/
git commit -m "refactor(frontend): extract roadmap templates, delete mockData.ts"
```

---

### Task 21: Split Large Files (Priority: Top 5)

Focus on the 5 largest files that are most impactful:

**Files to split:**
1. `EditChapterSheet.tsx` (1149 lines) → extract form sections
2. `EnrolledCoursesTable.tsx` (1004 lines) → extract column defs, row components
3. `EditProjectPage.tsx` (954 lines) → extract form sections
4. `CreateCourseForm.tsx` (792 lines) → extract wizard steps
5. `CartButton.tsx` (624 lines) → extract sub-components

- [ ] **Step 1: Split EditChapterSheet.tsx**

Extract into `_components/`:
- `ChapterFormFields.tsx` — form inputs
- `ChapterVideoUpload.tsx` — video upload section
- `ChapterQuizEditor.tsx` — quiz section (if present)

- [ ] **Step 2: Split EnrolledCoursesTable.tsx**

Extract:
- `EnrolledCourseColumns.tsx` — column definitions
- `EnrolledCourseRow.tsx` — individual row renderer
- `EnrolledCoursesFilters.tsx` — filter/search controls

- [ ] **Step 3: Split EditProjectPage.tsx**

Extract form sections into `_components/`:
- `ProjectBasicInfoForm.tsx`
- `ProjectRequirementsForm.tsx`
- `ProjectSubmissionSettings.tsx`

- [ ] **Step 4: Split CreateCourseForm.tsx**

Extract wizard steps:
- `CourseBasicInfoStep.tsx`
- `CourseCurriculumStep.tsx`
- `CoursePricingStep.tsx`
- `CoursePublishStep.tsx`

- [ ] **Step 5: Split CartButton.tsx**

Extract:
- `CartDropdown.tsx` — dropdown preview
- `CartItemCard.tsx` — individual cart item

- [ ] **Step 6: Build and verify after each split**

Run: `cd frontend && npm run build`

- [ ] **Step 7: Commit after each file split**

```bash
git commit -m "refactor(frontend): split EditChapterSheet into focused components"
git commit -m "refactor(frontend): split EnrolledCoursesTable into focused components"
# etc.
```

---

### Task 22: Final Verification

- [ ] **Step 1: Full backend build**

```bash
cd backend && npm run build
```

- [ ] **Step 2: Full frontend build**

```bash
cd frontend && npm run build
```

- [ ] **Step 3: Verify no mock data imports remain**

```bash
grep -rn "mockData\|mock/\|Coming Soon\|setTimeout.*simul" frontend/src/ --include="*.tsx" --include="*.ts"
```

- [ ] **Step 4: Verify no TODO items remain in critical paths**

```bash
grep -rn "TODO\|FIXME\|HACK" frontend/src/ backend/src/ --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v "\.d\.ts"
```

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: final verification — all pages functional, no mock data, builds clean"
```
