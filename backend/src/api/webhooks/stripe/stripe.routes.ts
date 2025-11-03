import { Router } from "express";
import bodyParser from "body-parser";
import { handleStripeWebhook } from "./stripe.controller";

const router: Router = Router();

// Stripe requires the raw body to validate the signature
router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
