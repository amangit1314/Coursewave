import Stripe from "stripe";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { generateUid } from "@/lib/helpers/id_helper";

export const POST = async (req: Request, { params }: {
  params: {
    id?: string
  }
}) => {
  const uuid4 = generateUid();
  const courseId = params.id;

  try {
    const reqBody = await req.json();
    const { userId } = reqBody;

    const user = await db.user.findUnique({
      where: {
        id: userId,
      }
    });

    if (!user) {
      return new NextResponse('UNAUTHORIZED ACCESS, You are not authorized to buy course, authenticate first', { status: 401 })
    }

    const course = await db.course.findUnique({
      where: {
        courseId,
      }
    });

    if (!course) {
      return new NextResponse('No such course found', { status: 404 })
    }

    const purchase = await prisma?.purchase.findUnique({
      where: {
        // id: `payment_${course?.courseId}_${uuid4}`,
        courseId: course?.courseId,
        userId: (user as { id: string }).id  // asseting user type here to prevent on {} id doesnot exist error
      }
    })

    if (purchase) {
      return new NextResponse('Course already purchased', { status: 400 })
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

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.email,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          id: customer.id,
          userId: user.id,
          stripeCustomerId: customer.id,
          stripePriceId: '',
          stripeSubscriptionId: ''
        }
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.courseId}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.courseId}?canceled=1`,
      metadata: {
        courseId: course.courseId,
        userId: user.id,
      }
    });

    return NextResponse.json({
      status: 'OK',
      success: true,
      url: session.url
    }, { status: 200 });
  } catch (error: any) {
    console.log("[COURSE_ID_CHECKOUT_ERROR]", error);
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}