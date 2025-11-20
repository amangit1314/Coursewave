import { Request, Response } from "express";
import * as cartService from "./cart.service";
import { sendSuccess, sendNotFound, sendError } from "../../core/middleware";

export const getCart = async (req: Request, res: Response) => {
  try {
    const result = await cartService.getCart(req.user?.id  || "");

    if (result.success) {
      sendSuccess(res, result.data, "Cart fetched successfully");
    } else {
      sendError(res, result.message, result.status);
    }
  } catch (error: any) {
    console.error("Error in getCart controller:", error);
    sendError(res, "Failed to fetch cart", 500, error.message);
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const result = await cartService.addToCart(req.user?.id  || "", req.body.courseId);

    if (result.success) {
      sendSuccess(res, result.data, "Course added to cart", 201);
    } else {
      if (result.status === 404) {
        sendNotFound(res, result.message);
      } else {
        sendError(res, result.message, result.status);
      }
    }
  } catch (error: any) {
    console.error("Error in addToCart controller:", error);
    sendError(res, "Failed to add item to cart", 500, error.message);
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const result = await cartService.removeFromCart(
      req.user?.id  || "",
      req.params.courseId
    );

    if (result.success) {
      sendSuccess(res, null, "Item removed from cart");
    } else {
      if (result.status === 404) {
        sendNotFound(res, result.message);
      } else {
        sendError(res, result.message, result.status);
      }
    }
  } catch (error: any) {
    console.error("Error in removeFromCart controller:", error);
    sendError(res, "Failed to remove item from cart", 500, error.message);
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const result = await cartService.clearCart(req.user?.id  || "");

    if (result.success) {
      sendSuccess(res, null, "Cart cleared successfully");
    } else {
      sendError(res, result.message, result.status);
    }
  } catch (error: any) {
    console.error("Error in clearCart controller:", error);
    sendError(res, "Failed to clear cart", 500, error.message);
  }
};
