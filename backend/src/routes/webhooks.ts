import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import { createEnrollment } from "../core/services/enrollmentService";

import { prisma } from '../config/prisma';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-06-30.basil" });

// Stripe requires the raw body to validate the signature
router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const courseId = session.metadata?.courseId;

      if (userId && courseId) {
        try {
          await createEnrollment(userId, courseId);
          console.log(`Enrollment created for user ${userId} and course ${courseId}`);
        } catch (err) {
          console.error("Failed to create enrollment:", err);
        }
      }
    }

    res.status(200).json({ received: true });
  }
);

export default router;
