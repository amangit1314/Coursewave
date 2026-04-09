import { Router } from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "./cart.controller";
import { verifyToken, validateUUID } from "../../core/middleware";

const router: Router = Router();

router.get("/", verifyToken, getCart);
router.post("/items", verifyToken, validateUUID("courseId"), addToCart);
router.delete("/items/:courseId", verifyToken, validateUUID("courseId"), removeFromCart);
router.delete("/", verifyToken, clearCart);

export default router;
