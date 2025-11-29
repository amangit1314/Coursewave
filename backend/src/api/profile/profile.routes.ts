import { Router } from "express";
import { verifyToken } from "../../core/middleware";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
  getUserStats,
  contactSupport,
  becomeInstructor,
} from "../profile/profile.controller";

const router: Router = Router();

// Get all users (admin only)
router.get("/", verifyToken, getAllUsers);

// Get user statistics (admin only)
router.get("/stats", verifyToken, getUserStats);

// Get user by ID (admin only)
router.get("/:userId", verifyToken, getUserById);

// Update user (admin only)
router.put("/:userId", verifyToken, updateUser);

// Change user role (admin only)
router.patch("/:userId/role", verifyToken, changeUserRole);

// Delete user (admin only)
router.delete("/:userId", verifyToken, deleteUser);

router.post("/contact", contactSupport);

router.post("/become-instructor", verifyToken, becomeInstructor);

export default router;
