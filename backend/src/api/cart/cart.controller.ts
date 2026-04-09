import { Request, Response } from "express";
import * as cartService from "./cart.service";
import {
  asyncHandler,
  sendSuccess,
  AppError,
} from "../../core/middleware/errorHandler";

const requireUserId = (req: Request): string => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  return userId;
};

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.getCart(requireUserId(req));
  sendSuccess(res, cart, "Cart fetched successfully");
});

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const item = await cartService.addToCart(requireUserId(req), req.body.courseId);
  sendSuccess(res, item, "Course added to cart", 201);
});

export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  await cartService.removeFromCart(requireUserId(req), req.params.courseId);
  sendSuccess(res, null, "Item removed from cart");
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  await cartService.clearCart(requireUserId(req));
  sendSuccess(res, null, "Cart cleared successfully");
});
