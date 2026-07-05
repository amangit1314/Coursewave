# Changelog

## v1.0 — 2026-07-05

Feature-complete checkpoint. 297 commits since Oct 2023. Closing out the project here rather than continuing indefinite polish.

### Core platform
- Auth (register/login/verify-email/forgot-reset-password)
- Courses: browse, detail, create/edit (instructor), categories, roadmaps
- Sessions: booking, my sessions, browse sessions, Stripe payment for sessions
- Cart, wishlist, subscriptions
- Checkout: real Stripe integration (replacing simulated payment flow)
- Profile, dashboard, settings
- Instructor tools: project/course management, analytics, store, help & support
- Communities: real-time chat, attachments via Cloudinary, member list/roles/moderation, info panel
- Articles, blogs, authors, feedback, feature requests, legal pages

### Cleanup done in this final push
- Removed all mock/placeholder data (cart coupons, analytics, authors, roadmaps categories) in favor of real API calls
- Removed all `href="#"` placeholder links
- Removed all TODO/FIXME comments from source (verified: zero remaining)
- Removed debug console.log statements
- Split several oversized components (CartButton, CreateCourseForm, EditProjectPage, EnrolledCoursesTable, EditChapterSheet) into focused pieces

### Known gaps (not blocking v1.0, but not production-hardened either)
- No automated test suite
- No CI pipeline verifying build/lint on push
- Golden paths (signup → purchase course → book session → community chat) not yet verified end-to-end in a real run

### Where this stops
This tag marks "done" for the current scope. Anything beyond this point is new work — track it as v1.1+ or a separate initiative, not "finishing v1."
