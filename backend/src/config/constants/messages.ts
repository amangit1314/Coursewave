/**
 * Centralized backend error and success messages.
 */

export const ERRORS = {
  // Generic
  INTERNAL: "Internal server error",
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access denied",
  BAD_REQUEST: "Invalid request",

  // Auth
  AUTH_EMAIL_REQUIRED: "Email is required",
  AUTH_PASSWORD_REQUIRED: "Password is required",
  AUTH_INVALID_CREDENTIALS: "Invalid credentials",
  AUTH_EMAIL_IN_USE: "Email already in use",
  AUTH_OAUTH_EMAIL_REQUIRED: "Email is required from OAuth provider",
  AUTH_USER_CREATE_FAILED: "Failed to create user",

  // Course
  COURSE_ID_REQUIRED: "courseId is required",
  COURSE_NOT_FOUND: "Course not found",
  COURSE_TITLE_REQUIRED: "Title is required",
  COURSE_DESC_REQUIRED: "Description is required",
  COURSE_PRICE_REQUIRED: "Price must be greater than 0 for paid courses",
  COURSE_CREATE_FAILED: "Failed to create course",
  COURSE_UPDATE_FAILED: "Failed to update course",
  COURSE_DELETE_FAILED: "Failed to delete course",

  // Session
  SESSION_NOT_FOUND: "Session not found",
  SESSION_BOOKING_EXISTS: "You have already booked this session",
  SESSION_NOT_AVAILABLE: "Session is not available for booking",
  SESSION_NOT_ACTIVE: "Session is not currently active",
  SESSION_NOT_STARTED: "Session has not started yet",
  SESSION_BOOKING_REQUIRED: "Valid paid booking required to join session",
  SESSION_BOOK_FAILED: "Failed to book session",
  SESSION_JOIN_FAILED: "Failed to join session",
  SESSION_CANCEL_FAILED: "Failed to cancel booking",

  // Payment
  PAYMENT_FAILED: "Payment processing failed",
  PAYMENT_BOOKING_NOT_FOUND: "Booking not found for payment",
} as const;

export const SUCCESS = {
  // Auth
  AUTH_LOGIN: "Login successful",
  AUTH_REGISTER: "Account created successfully",
  AUTH_LOGOUT: "Logged out successfully",

  // Course
  COURSE_CREATED: "Course created successfully",
  COURSE_UPDATED: "Course updated successfully",
  COURSE_DELETED: "Course deleted successfully",

  // Session
  SESSION_BOOKED: "Session booked successfully",
  SESSION_JOINED: "Session joined successfully",
  SESSION_CANCELLED: "Booking cancelled successfully",

  // Reviews
  REVIEW_CREATED: "Review submitted successfully",
  REVIEW_UPDATED: "Review updated successfully",
  REVIEW_DELETED: "Review deleted successfully",
} as const;
