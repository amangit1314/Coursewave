import { NextFunction, Router, Request, Response } from "express";
import {
  getAllUsers,
  getUserById,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUser,
  deleteSelf,
  getUserArticles,
  getSavedArticles,
  saveArticle,
  unsaveArticle,
  getUserEnrollments,
  checkEnrollment,
  checkArticleSaved,
} from "./users.controller";
import { verifyToken } from "../../core/middleware/verifyToken";
import { validate } from "../../core/middleware/validate";
import { userIdParams, updateProfileSchema, changePasswordSchema } from "./users.schemas";

const router: Router = Router();

/// =================== Enrollments (specific path, must come before :userId)
//! Note: must not change order of routes, it will cause issues in route matching
router.get("/enrollments", verifyToken, getUserEnrollments); // (only self)
router.get("/enrollments/:courseId", verifyToken, checkEnrollment); // check if enrolled

/// ===================== User routes =====================
router.get("/", verifyToken, getAllUsers); // (admin only)
router.get("/:userId", verifyToken, validate(userIdParams, "params"), getUserById); // (admin or self)
router.delete("/:userId", verifyToken, deleteUser); // (admin only)

/// ========================  Articles ============================
router.get("/articles/created", verifyToken, getUserArticles); // (self only)
router.get("/articles/saved", verifyToken, getSavedArticles); // (self only)
router.post("/articles/saved/:articleId", verifyToken, saveArticle); // (self only)
router.delete("/articles/saved/:articleId", verifyToken, unsaveArticle); // (self only)
router.get("/articles/saved/:articleId/check", verifyToken, checkArticleSaved); // (self only)

/// ======================= FOR LOGED IN USER ============
router.get("/me", verifyToken, getUserProfile); // (self only)
router.put("/profile", verifyToken, validate(updateProfileSchema), updateUserProfile); // (self only)
router.put("/change-password", verifyToken, validate(changePasswordSchema), changePassword); // (self only)
router.delete("/", verifyToken, deleteSelf); // (self only)

export default router;
