import { Request, Response } from "express";
import * as wishlistService from "./wishlist.service";

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const result = await wishlistService.getWishlist(req.user.id);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
      error: error.message
    });
  }
};

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const result = await wishlistService.addToWishlist(req.user.id, req.body.courseId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to add course to wishlist",
      error: error.message
    });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const result = await wishlistService.removeFromWishlist(req.user.id, req.params.courseId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to remove course from wishlist",
      error: error.message
    });
  }
};

export const checkWishlistStatus = async (req: Request, res: Response) => {
  try {
    const result = await wishlistService.checkWishlistStatus(req.user.id, req.params.courseId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to check wishlist status",
      error: error.message
    });
  }
};

export const getWishlistCount = async (req: Request, res: Response) => {
  try {
    const result = await wishlistService.getWishlistCount(req.user.id);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist count",
      error: error.message
    });
  }
};

export const clearWishlist = async (req: Request, res: Response) => {
  try {
    const result = await wishlistService.clearWishlist(req.user.id);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to clear wishlist",
      error: error.message
    });
  }
};