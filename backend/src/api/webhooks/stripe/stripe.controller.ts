import { Request, Response } from "express";
import * as stripeService from "./stripe.service";
import { asyncHandler } from "../../../core/middleware/errorHandler";

// Stripe webhook endpoint.
// - On success: respond 200 with { received: true } (Stripe reads status code only)
// - On signature failure: service throws AppError(400), errorHandler responds 400
// - On handler failure: error bubbles, errorHandler responds 500 → Stripe retries
export const handleStripeWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;
    const result = await stripeService.handleWebhookEvent(req.body, signature);
    res.status(200).json(result);
  }
);
