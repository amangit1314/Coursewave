import express from "express";
import { verifyToken } from "../../core/middleware";
import { checkAccessToken } from "../../core/middleware";
import * as TokenController from "./token-management.controller";

const router = express.Router();

// User session management
router.get("/sessions", verifyToken, TokenController.getUserSessions);
router.delete(
  "/sessions/:sessionId",
  verifyToken,
  TokenController.revokeSession
);
router.delete("/sessions", verifyToken, TokenController.revokeAllSessions);

// Token rollback
router.post("/rollback", verifyToken, TokenController.rollbackToken);

// Refresh token
router.post("/refresh", TokenController.refreshAccessToken);

// Security validation
router.post(
  "/validate-security",
  verifyToken,
  TokenController.validateSecurity
);

// Admin endpoints
router.post("/cleanup", verifyToken, TokenController.cleanupExpiredTokens);
router.get("/stats", verifyToken, TokenController.getTokenStats);

export default router;
