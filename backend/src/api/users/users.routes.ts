import { Router } from "express";
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
} from "./users.controller";
import { verifyToken } from "../../core/middleware";
import { checkAccessToken } from "../../core/middleware";

const router: Router = Router();

// User routes
router.get("/", verifyToken, getAllUsers);
router.get("/me", verifyToken, getUserProfile);
router.get("/:userId", verifyToken, getUserById);
router.put("/profile", verifyToken, updateUserProfile);
router.put("/change-password", verifyToken, changePassword);
router.delete("/:userId", verifyToken, deleteUser);
router.delete("/", verifyToken, deleteSelf);

// Article routes
router.get("/articles/created", verifyToken, getUserArticles);
router.get("/articles/saved", verifyToken, getSavedArticles);
router.post("/articles/saved/:articleId", verifyToken, saveArticle);
router.delete("/articles/saved/:articleId", verifyToken, unsaveArticle);

// Enrollment routes
router.get("/enrollments", verifyToken, getUserEnrollments);
router.get("/enrollments/:courseId", verifyToken, checkEnrollment);

export default router;
