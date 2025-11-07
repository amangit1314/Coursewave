// Utility function (can be placed in a services/utilities file)

import Stripe from "stripe";
import { prisma } from "../../config/prisma";
import { stripe } from "../../config/stripe";

export async function ensureStripeCustomerForUser(
  userId: string,
  email?: string
): Promise<string> {
  // 1. Check if StripeCustomer already exists in DB
  let stripeCustomerRecord = await prisma.stripeCustomer.findUnique({
    where: { userId },
  });

  if (stripeCustomerRecord) {
    // Already exists, return stripeCustomerId
    return stripeCustomerRecord.stripeCustomerId;
  }

  // 2. Otherwise, create on Stripe
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const customerEmail = email || user?.email || undefined;
  const stripeCustomer = await stripe.customers.create({
    email: customerEmail,
    metadata: { userId },
  });

  // 3. Save to DB
  stripeCustomerRecord = await prisma.stripeCustomer.create({
    data: {
      stripeCustomerId: stripeCustomer.id,
      userId,
      // Add other fields as needed
    },
  });

  return stripeCustomerRecord.stripeCustomerId;
}
