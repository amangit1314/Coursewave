import { Router } from "express";
import { handleStripeWebhook } from "./stripe.controller";

const router: Router = Router();

// Stripe requires the raw body to validate the signature
router.post(
  "/",
  handleStripeWebhook
);

export default router;
