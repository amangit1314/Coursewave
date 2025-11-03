import { Router } from "express";
import { verifyToken } from "../../core/middleware";
import { checkAccessToken } from "../../core/middleware";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
  getUserStats,
  contactSupport,
} from "../profile/profile.controller";

const router: Router = Router();

// Apply authentication to all routes
router.use(verifyToken);

// Get all users (admin only)
router.get("/", getAllUsers);

// Get user statistics (admin only)
router.get("/stats", getUserStats);

// Get user by ID (admin only)
router.get("/:userId", getUserById);

// Update user (admin only)
router.put("/:userId", updateUser);

// Change user role (admin only)
router.patch("/:userId/role", changeUserRole);

// Delete user (admin only)
router.delete("/:userId", deleteUser);

router.post("/contact", checkAccessToken, contactSupport);

export default router;
