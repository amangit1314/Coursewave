import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
  getWishlistCount,
  clearWishlist
} from "./wishlist.controller";
import { verifyToken } from "../../core/middleware";
import { checkAccessToken } from "../../core/middleware";

const router: Router = Router();

// Wishlist routes
router.get("/", verifyToken, getWishlist);
router.post("/items", verifyToken, addToWishlist);
router.delete("/courses/:courseId", verifyToken, removeFromWishlist);
router.get("/check/:courseId", verifyToken, checkWishlistStatus);
router.get("/count", verifyToken, getWishlistCount);
router.delete("/clear", verifyToken, clearWishlist);

export default router;