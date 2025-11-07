import Stripe from "stripe";
// import { createEnrollment } from "../../../core/services/enrollmentService";
import { stripe } from "../../../config/stripe";
import { SubscriptionStatus } from "@prisma/client";
import {
  handleSubscriptionCheckoutSessionComplted,
  handleSubscriptionDeleted,
  handleSubscriptionUpdated,
} from "../../subscription/subscription.service";
import { activateEnrollmentAfterPayment } from "../../../core/services/enrollmentService";

interface ServiceResponse {
  success: boolean;
  data?: any;
  message: string;
  status: number;
  error?: string;
}

export function mapStripeStatus(status: string): SubscriptionStatus {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIAL";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
      return "CANCELED";
    case "incomplete":
      return "INCOMPLETE";
    case "unpaid":
      return "UNPAID";
    default:
      throw new Error("Unhandled Stripe status: " + status);
  }
}

// Webhook handler (resolves by unique stripeSubscriptionId)
export const handleWebhookEvent = async (
  rawBody: Buffer,
  signature: string
): Promise<ServiceResponse> => {
  try {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed.", err.message);
      return {
        success: false,
        message: `Webhook Error: ${err.message}`,
        status: 400,
        error: err.message,
      };
    }

    // Handle different webhook events
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event);
        await handleSubscriptionCheckoutSessionComplted(event);

        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event);
        break;

      case "customer.subscription.created":
        break;

      case "customer.subscription.updated": {
        await handleSubscriptionUpdated(event);
        break;
      }

      case "customer.subscription.deleted": {
        await handleSubscriptionDeleted(event);
        break;
      }

      case "invoice.payment_failed":
        // todo: ...Implement PAST_DUE logic as needed
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return {
      success: true,
      data: { received: true },
      message: "Webhook processed successfully",
      status: 200,
    };
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return {
      success: false,
      message: "Failed to process webhook",
      error: error.message,
      status: 500,
    };
  }
};

/// -------------------------------------------------------------------------------------------------------------

const handleCheckoutSessionCompleted = async (
  event: Stripe.Event
): Promise<void> => {
  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.userId;
  const courseId = session.metadata?.courseId;

  if (userId && courseId) {
    try {
      await activateEnrollmentAfterPayment(userId, courseId);
      console.log(
        `Enrollment created for user ${userId} and course ${courseId}`
      );

      // You can add additional logic here, such as:
      // - Sending confirmation email
      // - Updating order status in database
      // - Notifying admin about new purchase
    } catch (err) {
      console.error("Failed to create enrollment:", err);
      // Consider implementing retry logic or dead letter queue for failed enrollments
    }
  } else {
    console.warn(
      "Missing userId or courseId in session metadata",
      session.metadata
    );
  }
};

const handlePaymentIntentSucceeded = async (
  event: Stripe.Event
): Promise<void> => {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  console.log(`PaymentIntent ${paymentIntent.id} succeeded`);

  // You can add additional logic for successful payments
  // Example: Update order status, send receipt, etc.
};

const handlePaymentIntentFailed = async (
  event: Stripe.Event
): Promise<void> => {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  console.log(`PaymentIntent ${paymentIntent.id} failed`);

  // You can add additional logic for failed payments
  // Example: Notify user, update order status, etc.
};

const handleChargeRefunded = async (event: Stripe.Event): Promise<void> => {
  const charge = event.data.object as Stripe.Charge;
  console.log(`Charge ${charge.id} was refunded`);

  // You can add additional logic for refunds
  // Example: Remove enrollment, update order status, etc.
};

/// ====================================================================================================================

// Additional utility functions for Stripe operations
export const createCheckoutSession = async (
  priceId: string,
  userId: string,
  courseId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        courseId,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session;
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
};

export const createPaymentIntent = async (
  amount: number,
  currency: string = "usd",
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    throw new Error(`Failed to create payment intent: ${error.message}`);
  }
};

export const getPaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error: any) {
    console.error("Error retrieving payment intent:", error);
    throw new Error(`Failed to retrieve payment intent: ${error.message}`);
  }
};

export const refundPayment = async (
  paymentIntentId: string
): Promise<Stripe.Refund> => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    return refund;
  } catch (error: any) {
    console.error("Error creating refund:", error);
    throw new Error(`Failed to create refund: ${error.message}`);
  }
};
