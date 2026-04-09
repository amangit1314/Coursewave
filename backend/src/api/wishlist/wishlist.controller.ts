import { Request, Response } from "express";
import * as wishlistService from "./wishlist.service";
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

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const data = await wishlistService.getWishlist(requireUserId(req));
  sendSuccess(res, data, "Wishlist fetched successfully");
});

export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const data = await wishlistService.addToWishlist(
    requireUserId(req),
    req.body.courseId
  );
  sendSuccess(res, data, "Course added to wishlist", 201);
});

export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const data = await wishlistService.removeFromWishlist(
    requireUserId(req),
    req.params.courseId
  );
  sendSuccess(res, data, "Course removed from wishlist");
});

export const checkWishlistStatus = asyncHandler(async (req: Request, res: Response) => {
  const data = await wishlistService.checkWishlistStatus(
    requireUserId(req),
    req.params.courseId
  );
  sendSuccess(res, data, "Wishlist status checked successfully");
});

export const getWishlistCount = asyncHandler(async (req: Request, res: Response) => {
  const data = await wishlistService.getWishlistCount(requireUserId(req));
  sendSuccess(res, data, "Wishlist count fetched successfully");
});

export const clearWishlist = asyncHandler(async (req: Request, res: Response) => {
  await wishlistService.clearWishlist(requireUserId(req));
  sendSuccess(res, null, "Wishlist cleared successfully");
});
