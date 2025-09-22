import express from "express";
import { Router } from "express";
import {
  bookSession,
  cancelBooking,
  createSession,
  getAllSessions,
  getMyFutureScheduledSessions,
  getSessionById,
  joinSession,
  payForSession,
} from "./sessions.controller";
import { validateUUID } from "../../core/middleware/validation";
import { verifyToken } from "../../core/middleware";
import { checkAccessToken } from "../../core/middleware";
import { requireInstructor } from "../../core/middleware/requireInstructor";

const router: Router = express.Router();

// Get all available sessions (public)
router.get("/", getAllSessions);

// Get session details by ID (public)
router.get("/:sessionId", validateUUID("sessionId"), getSessionById);

// Create new session (instructor only)
router.post(
  "/",
  verifyToken,
  requireInstructor,
  //   invalidateCacheAfter('sessions'),
  createSession
);

// Book a session (authenticated users)
router.post(
  "/:sessionId/book",
  verifyToken,
  validateUUID("sessionId"),
  bookSession
);

// Process payment for session booking
router.post(
  "/:sessionId/pay",
  verifyToken,
  validateUUID("sessionId"),
  payForSession
);

// Join a session (authenticated users with valid booking)
router.post(
  "/:sessionId/join",
  verifyToken,
  validateUUID("sessionId"),
  joinSession
);

// Cancel a booking (authenticated users)
router.delete(
  "/:sessionId/cancel",
  verifyToken,
  validateUUID("sessionId"),
  cancelBooking
);

// Get user's upcoming sessions
router.get("/my/upcoming", verifyToken, getMyFutureScheduledSessions);

export default router;
