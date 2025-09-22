import { Router } from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} from "./cart.controller";
import { 
  verifyToken, 
  validateUUID,
  asyncHandler 
} from "../../core/middleware";

const router: Router = Router();

router.get("/", 
  verifyToken,
  asyncHandler(getCart)
);

router.post("/items", 
  verifyToken,
  validateUUID('courseId'),
  asyncHandler(addToCart)
);

router.delete("/items/:courseId", 
  verifyToken,
  validateUUID('courseId'),
  asyncHandler(removeFromCart)
);

router.delete("/", 
  verifyToken,
  asyncHandler(clearCart)
);

export default router;