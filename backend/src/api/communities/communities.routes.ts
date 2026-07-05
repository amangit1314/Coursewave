import { Router } from "express";
import { verifyToken } from "../../core/middleware";
import { checkAccessToken } from "../../core/middleware";
import { isCommunityModerator } from "../../core/middleware/isCommunityModerator";
import { isCommunityAdmin } from "../../core/middleware/isCommunityAdmin";
import {
  getAllCommunities,
  getCommunityById,
  createCommunity,
  joinCommunity,
  getCommunityMessages,
  getCommunityMembers,
  updateCommunity,
  deleteCommunity,
  updateMemberRole,
  kickMember,
  deleteMessage,
  sendMessage,
  leaveCommunity,
} from "./communitites.controller";
import { uploadMiddleware, uploadCommunityAttachment } from "./upload.controller";

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

// Get members for a community (requires membership)
router.get("/:communityId/members", verifyToken, getCommunityMembers);

// Send a message to a community (requires membership)
router.post("/:communityId/messages", verifyToken, sendMessage);

// Leave a community (requires membership)
router.post("/:communityId/leave", verifyToken, leaveCommunity);

// Upload a chat attachment (requires membership)
router.post(
  "/:communityId/upload",
  verifyToken,
  uploadMiddleware,
  uploadCommunityAttachment
);

// Update a community (admin only)
router.patch("/:communityId", verifyToken, isCommunityAdmin, updateCommunity);

// Delete a community (admin only)
router.delete("/:communityId", verifyToken, isCommunityAdmin, deleteCommunity);

// Change a member's role (admin only)
router.patch(
  "/:communityId/members/:userId/role",
  verifyToken,
  isCommunityAdmin,
  updateMemberRole
);

// Kick a member (moderator or admin)
router.delete(
  "/:communityId/members/:userId",
  verifyToken,
  isCommunityModerator,
  kickMember
);

// Delete a message (requires admin/moderator role)
router.delete(
  "/:communityId/messages/:messageId",
  verifyToken,
  isCommunityModerator,
  deleteMessage
);

export default router;
