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
import { r } from "@upstash/redis/zmscore-BshEAkn7";
// import { checkAccessToken } from "../../core/middleware";

// Add this to your users.routes.ts temporarily
const traceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("=== ROUTE TRACING ===");
  console.log("1. Route reached:", req.method, req.path);
  console.log("2. User object:", req.user);
  console.log("3. User roles:", req.user?.roles);
  next();
};

const errorTraceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalSend = res.send;
  res.send = function (data) {
    console.log("4. Response status:", res.statusCode);
    console.log("5. Response data:", data);
    return originalSend.call(this, data);
  };
  next();
};

const router: Router = Router();

/// ===================== User routes =====================
router.get("/", verifyToken, getAllUsers); // (admin only)
router.get("/:userId", verifyToken, getUserById); // (admin or self)
router.delete("/:userId", verifyToken, deleteUser); // (admin only)

/// =================== Enrollments (specific path, must come before :userId)
router.get(
  "/enrollments",
  verifyToken,
  // traceMiddleware,
  // errorTraceMiddleware,
  getUserEnrollments
); // (only self)
router.get("/enrollments/:courseId", verifyToken, checkEnrollment); // check if enrolled

/// ========================  Articles ============================
router.get("/articles/created", verifyToken, getUserArticles); // (self only)
router.get("/articles/saved", verifyToken, getSavedArticles); // (self only)
router.post("/articles/saved/:articleId", verifyToken, saveArticle); // (self only)
router.delete("/articles/saved/:articleId", verifyToken, unsaveArticle); // (self only)
router.get("/articles/saved/:articleId/check", verifyToken, checkArticleSaved); // (self only)

/// ======================= FOR LOGED IN USER ============
router.get("/me", verifyToken, getUserProfile); // (self only)
router.put("/profile", verifyToken, updateUserProfile); // (self only)
router.put("/change-password", verifyToken, changePassword); // (self only)
router.delete("/", verifyToken, deleteSelf); // (self only)

export default router;
