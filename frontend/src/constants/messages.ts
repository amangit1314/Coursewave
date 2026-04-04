/**
 * Centralized UI strings and messages for the entire application.
 * Grouped by domain for easy lookup.
 */

// ── Course Detail Page ──────────────────────────────────────
export const COURSE_MESSAGES = {
  // Headings
  ABOUT_TITLE: "About This Course",
  ABOUT_SUBTITLE: "Everything you need to know before enrolling",
  LEARN_TITLE: "What You'll Learn",
  LEARN_SUBTITLE: "Master these essential skills and concepts",
  REQUIREMENTS_TITLE: "Requirements",
  REQUIREMENTS_SUBTITLE: "What you need before starting",
  CONTENT_TITLE: "Course Content",
  ACCESS_TITLE: "Course Access Information",

  // Empty states
  NO_DESCRIPTION: "No description provided for this course yet.",
  NO_LEARNING_OUTCOMES: "Learning outcomes have not been added yet.",
  NO_PREREQUISITES: "No specific prerequisites — all levels welcome.",
  NO_CONTENT: "Course content is being prepared. Check back soon.",
  PRICE_NOT_SET: "Price not set",

  // Labels
  STUDENTS_LABEL: "Students",
  AVG_RATING_LABEL: "Avg Rating",
  LEVEL_LABEL: "Level",
  TOTAL_DURATION: "Total Duration",
  LIFETIME_ACCESS: "Lifetime access",
  ONE_TIME_PAYMENT: "One-time payment",
  MONEY_BACK: "30-Day Money-Back Guarantee",
  PREVIEW_AVAILABLE: "Preview Available",
  COURSE_INCLUDES: "This course includes:",
  TECHNOLOGIES_COVERED: "Technologies covered:",
  TOTAL_OUTCOMES: "Total learning outcomes",
  BEGINNER_FRIENDLY: "Beginner-friendly course",
  EASY_REQUIREMENTS: "Easy requirements to get started",
  POPULAR_CHOICE: "Popular Choice",

  // Access notice
  ACCESS_NOTICE: (totalLessons: number, premiumLessons: number) =>
    `The first 2 lessons are available for free preview. Enroll in the course to unlock all ${totalLessons} lessons, including ${premiumLessons} premium lessons with lifetime access.`,

  // Course includes items
  VIDEO_CONTENT: "Video content",
  CERTIFICATE: "Certificate of completion",
  DOWNLOADABLE: "Downloadable resources",
  FULL_ACCESS: "Full lifetime access",
  MOBILE_ACCESS: "Access on mobile and TV",
} as const;

// ── Error Messages ──────────────────────────────────────────
export const ERROR_MESSAGES = {
  // Generic
  GENERIC: "Something went wrong. Please try again.",
  NOT_FOUND: "The requested resource was not found.",
  UNAUTHORIZED: "Please log in to continue.",
  FORBIDDEN: "You don't have permission to perform this action.",

  // Course
  COURSE_NOT_FOUND: "Course not found",
  COURSE_LOAD_FAILED: "Failed to load course",
  COURSE_CONTENT_LOAD_FAILED: "Failed to load course content",
  COURSE_CREATE_TITLE_REQUIRED: "Title is required",
  COURSE_CREATE_DESC_REQUIRED: "Description is required",
  COURSE_CREATE_PRICE_REQUIRED: "Price must be greater than 0 for paid courses",

  // Auth
  LOGIN_FAILED: "Invalid email or password",
  REGISTER_FAILED: "Registration failed. Please try again.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",

  // Payment
  PAYMENT_FAILED: "Payment processing failed. Please try again.",
  BOOKING_FAILED: "Booking failed. Please try again.",

  // Session
  SESSION_NOT_FOUND: "Session not found.",
  SESSION_JOIN_FAILED: "Unable to join session.",
  SESSION_LOAD_FAILED: "Failed to load session details.",
} as const;

// ── Success Messages ────────────────────────────────────────
export const SUCCESS_MESSAGES = {
  PAYMENT_SUCCESS: "Payment successful! You are now enrolled.",
  ENROLLMENT_SUCCESS: "Successfully enrolled in the course!",
  BOOKING_CONFIRMED: "Booking confirmed!",
  REVIEW_SUBMITTED: "Review submitted successfully.",
  PASSWORD_RESET: "Password has been reset successfully.",
  PROFILE_UPDATED: "Profile updated successfully.",
} as const;

// ── HTTP Status Codes ───────────────────────────────────────
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;

// ── Pluralization helper ────────────────────────────────────
export const pluralize = (count: number, singular: string, plural?: string) =>
  count === 1 ? singular : (plural ?? `${singular}s`);
