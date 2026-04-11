import { Request, Response } from "express";
import {
  sendContactMessage,
  sendFeedback,
  sendFeatureRequest,
} from "./contact.service";
import { asyncHandler, sendSuccess } from "../../core/middleware/errorHandler";

export const handleContact = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, phone, subject, message } = req.body;

    await sendContactMessage({
      name,
      phone,
      subject,
      message,
      toEmail: "gitaman8481@gmail.com",
    });

    sendSuccess(res, null, "Message sent successfully");
  }
);

export const submitFeedback = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, type, rating, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
      return;
    }

    const feedbackType = type || "general";
    const feedbackRating = rating ? Math.min(5, Math.max(1, Number(rating))) : 3;

    await sendFeedback({
      name,
      email,
      type: feedbackType,
      rating: feedbackRating,
      message,
      toEmail: "gitaman8481@gmail.com",
    });

    sendSuccess(res, null, "Feedback submitted successfully");
  }
);

export const submitFeatureRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, title, category, description, priority } = req.body;

    if (!name || !email || !title || !description) {
      res.status(400).json({
        success: false,
        message: "Name, email, title, and description are required",
      });
      return;
    }

    await sendFeatureRequest({
      name,
      email,
      title,
      category: category || "general",
      description,
      priority: priority || "medium",
      toEmail: "gitaman8481@gmail.com",
    });

    sendSuccess(res, null, "Feature request submitted successfully");
  }
);
