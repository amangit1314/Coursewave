import { Router } from "express";
import { verifyToken } from "../../core/middleware";
import { checkAccessToken } from "../../core/middleware";
import { isCommunityModerator } from "../../core/middleware/isCommunityModerator";
import {
  getAllCommunities,
  getCommunityById,
  createCommunity,
  joinCommunity,
  getCommunityMessages,
  deleteMessage,
  sendMessage,
  leaveCommunity,
} from "./communitites.controller";

const router: Router = Router();

// Get all communities (public ones)
router.get("/", getAllCommunities);

// Get a specific community by ID
router.get("/:communityId", verifyToken, getCommunityById);

// Create a new community (requires authentication)
router.post("/", verifyToken, createCommunity);

// User joins a community
router.post("/:communityId/join", verifyToken, joinCommunity);

// Get messages for a community (requires membership)
router.get("/:communityId/messages", verifyToken, getCommunityMessages);

// Send a message to a community (requires membership)
router.post("/:communityId/messages", verifyToken, sendMessage);

// Leave a community (requires membership)
router.post("/:communityId/leave", verifyToken, leaveCommunity);

// Delete a message (requires admin/moderator role)
router.delete(
  "/:communityId/messages/:messageId",
  verifyToken,
  isCommunityModerator,
  deleteMessage
);

export default router;
