import { prisma } from "../../config/prisma";
import { stripe } from "../../config/stripe";

/**
 * Ensures a Stripe customer exists for a given user.
 * Returns stripeCustomerId from your StripeCustomer model.
 *
 * @param userId The internal user ID (from your User table).
 * @param userEmail The user's email (used for creating Stripe customer).
 */
export const ensureStripeCustomerForUser = async (
  userId: string,
  userEmail?: string
): Promise<string> => {
  // Try to find the StripeCustomer record in your DB
  let stripeCustomerRecord = await prisma.stripeCustomer.findUnique({
    where: { userId }, // model has @unique on userId
  });

  // If exists, return the Stripe customer ID
  if (stripeCustomerRecord && stripeCustomerRecord.stripeCustomerId) {
    return stripeCustomerRecord.stripeCustomerId;
  }

  // If not, make sure you have email to create Stripe customer
  if (!userEmail) {
    // If email not passed, look up user and fetch email
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.email) {
      throw new Error("User email required to create Stripe customer");
    }
    userEmail = user.email;
  }

  // Create Stripe customer in Stripe
  const customer = await stripe.customers.create({
    email: userEmail,
    metadata: { userId },
  });

  // Create record in DB
  stripeCustomerRecord = await prisma.stripeCustomer.create({
    data: {
      userId,
      stripeCustomerId: customer.id,
      // Optional defaults for other fields:
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return customer.id;
};
