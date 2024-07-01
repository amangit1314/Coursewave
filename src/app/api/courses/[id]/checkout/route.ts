import Stripe from "stripe";
import { db } from "@/lib/db";
import { stripe } from "@/config/stripe";
import { NextRequest, NextResponse } from "next/server";
import { generateUid } from "@/helpers/id_helper";
export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/lib/cors';
import { absoluteUrl } from "@/utils/utils";

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export const POST = async (req: Request, { params }: {
  params: {
    id: string
  }
}) => {
  const uuid4 = generateUid();
  const courseId = params?.id!;

  try {
    const reqBody = await req.json();
    const { userId } = reqBody;

    if (!userId) {
      return new NextResponse('MISSING REQUIRED FIELDS, userId is required', { status: 400 });
    }

    const user = await db.user.findUnique({
      where: {
        id: userId as string,
      }
    });

    if (!user) {
      return new NextResponse('NOT FOUND, No user found with this userId, You are not authorized to buy course, authenticate first', { status: 404 })
    }

    const course = await db.course.findUnique({
      where: {
        courseId,
      }
    });

    if (!course) {
      return new NextResponse('NOT FOUND, No such course found ...', { status: 404 })
    }

    const purchase = await db.purchase.findFirst({
      where: {
        courseId: course.courseId,
        userId: user.id,
      }
    })

    if (purchase) {
      console.log('Course already purchased ...')
      return new NextResponse('Course already purchased ...', { status: 400 })
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: course.courseTitle,
          description: course.courseDescription!,
        },
        unit_amount: Math.round(parseInt(course.coursePrice!) * 100)
      }
    }]

    let stripeCustomer = await db.stripeCustomer.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      }
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.email,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        }
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: 'payment',
      success_url: absoluteUrl(`/courses/${course.courseId}?success=1`),
      cancel_url: absoluteUrl(`/courses/${course.courseId}?canceled=1`),
      metadata: {
        courseId: course.courseId,
        userId: user.id,
      }
    });

    // * ------------------- Purchase of courseId by the userid ------------------------------
    const purchaseId = `purchase_${courseId}_${uuid4.split('-')[0]}`;

    const createdPurchase = await db.purchase.create({
      data: {
        id: purchaseId as string,
        userId: userId as string,
        courseId: course?.courseId,
        amount: course?.coursePrice!,
      }
    })

    console.log('Created Purchase: ', createdPurchase);

    // * ------------------- Enrollement for the userid with the courseid ---------------------
    const enrollementId = `enrollement_${courseId}_${userId.split('-')[0]}`;

    const courseProgress = await db.courseProgress.create({
      data: {
        userId: userId! as string,
        courseId: courseId!,
        enrollmentId: enrollementId,
        progress: 0.0,
        completedPercentage: 0,
      }
    });

    const createdEnrollement = await db.enrollment.create({
      data: {
        enrollmentId: enrollementId,
        userId,
        courseId: course.courseId,
        courseTitle: course.courseTitle,
        enrollmentDate: Date().toString(),
        enrollmentStatus: "ACTIVE",
        courseProgressId: courseProgress.id,
      }
    })

    console.log('Created Enrollement: ', createdEnrollement);

    return NextResponse.json({
      status: 'OK',
      success: true,
      url: session.url
    }, { status: 200 });
  } catch (error: any) {
    console.log("[COURSE_ID_CHECKOUT_ERROR]", error);
    return new NextResponse('Internal Server Error, in creasting stripe checkout seession url', { status: 500 })
  }
}