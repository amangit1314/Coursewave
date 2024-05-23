import { db } from "@/lib/db";
import { stripe } from "@/config/stripe";
import { storeSubscriptionPlans } from "@/lib/subscriptions";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export const GET = async (req: NextRequest, {params}: {params: {userId: string}}) => {
  try {

    const userId = params?.userId;
    console.log('user id: ', userId)

    if (!userId) {
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: 'MISSING REQUIRED FIELDS, userid is a required field ...',
      }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      // select: {
      //   id: true,
      //   email: true,
      //   stripeSubscriptionId: true,
      //   stripeCurrentPeriodEnd: true,
      //   stripeCustomerId: true,
      //   stripePriceId: true,
      // },
    })

    if (!user) {
      console.log("No user found with this id ...");
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: 'No user found in database with this id ❌🚧 ...',
      }, { status: 404 });
    }

    const stripeCustomer = await db.stripeCustomer.findFirst({
      where: {
        userId: user.id,
      }
    })

    if (!stripeCustomer) {
      console.log("No customer found with this id ...");
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: 'No stripe customer found in database with this id ❌🚧 ...',
      }, { status: 404 });
    }

    const subscription = await db.subscription.findFirst({
      where: {
        userId: stripeCustomer.userId,
      }
    });

    if (!subscription) {
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: 'No subscription found with this userId ❌🚧 ...',
      }, { status: 404 });
    }

    // Check if user is on a pro plan.
    const isPro =
      stripeCustomer?.stripePriceId! &&
      stripeCustomer?.stripeCurrentPeriodEnd?.getTime()! + 86_400_000 > Date.now()

    // -------------------
    const plan = isPro ? storeSubscriptionPlans.find((p) => p.stripePriceId === stripeCustomer.stripePriceId) : null;

    let isCanceled = false;
    if (isPro && stripeCustomer.stripeSubscriptionId) {
      const stripePlan = await stripe.subscriptions.retrieve(stripeCustomer.stripeSubscriptionId);
      isCanceled = stripePlan.cancel_at_period_end;
    }

    const data = {
      ...plan,
      ...subscription,
      stripeSubscriptionId: stripeCustomer.stripeSubscriptionId,
      stripeCurrentPeriodEnd: stripeCustomer?.stripeCurrentPeriodEnd?.getTime(),
      stripeCustomerId: stripeCustomer.stripeCustomerId,
      isPro: !!isPro,
      isSubscribed: !!isPro,
      isCanceled: isCanceled,
    }

    console.log(`Subscription Data: ${JSON.stringify(data)}`);
    return NextResponse.json({
      status: 'OK',
      success: true,
      data: data,
      message: 'Subscription data fetched successfully ✔️ ...',
    }, { status: 200 });
  } catch (error: any) {
    console.log(`Internal server error: ${error.message} ❌🚧, Error in fetching user subscription data ...`)
    return NextResponse.json({
      status: 'OK',
      success: true,
      error: error.message,
      message: 'Internal server error, Error in fetching user subscription data ❌🚧 ...',
    }, { status: 200 });
  }
}