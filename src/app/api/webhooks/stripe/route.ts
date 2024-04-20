import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    return new NextResponse(`Webhook error: ${error.message}`, {
      status: 400,
    })
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId) {
      return new NextResponse("User ID is required for subscription ...", {
        status: 400
      });
    }

    const createdSubscription = await db.subscription.create({
      data: {
        id: subscription.id,
        userId: session.metadata.userId,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000,),
      }
    });

    console.log('Created Subscription in checkout session completed event: ', createdSubscription);

    // --------------- for course payment 👇 --------------------
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;
    if (!userId || !courseId) {
      return new NextResponse("MISSING REQUIRED FIELDS, please provide userId and courseId to buy the course", { status: 400 });
    }

    const course = await db.course.findUnique({
      where: {
        courseId: courseId,
      }
    })

    if (!course) {
      return new NextResponse("INVALID COURSE ID, No course found with this courseId ...", { status: 400 });
    }

    await db.purchase.create({
      data: {
        courseId: courseId,
        userId: userId,
        amount: course?.coursePrice!,
      }
    })
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const updatedSubscription = await db.subscription.update({
      where: {
        id: subscription.id,
        userId: session?.metadata?.userId!,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000,)
      }
    })

    console.log('Updated Subscription in invoice payment succeeded event: ', updatedSubscription);
  }

  else {
    return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 });
  }

  return new NextResponse(null, { status: 200 });
}