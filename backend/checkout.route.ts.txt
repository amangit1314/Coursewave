import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/config/stripe";

export const dynamic = 'force-dynamic';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  return new NextResponse('OK', { status: 200 });
}

export const POST = async (req: NextRequest, { params }: {
  params: Promise<{
    id: string
  }>
}) => {
  try {
    const { id: courseId } = await params;
    const reqBody = await req.json();
    const { userId } = reqBody;

    console.log("Frontend checkout API called with:", { courseId, userId });

    if (!userId) {
      return new NextResponse('MISSING REQUIRED FIELDS, userId is required', { status: 400 });
    }

    if (!courseId) {
      return new NextResponse('MISSING REQUIRED FIELDS, courseId is required', { status: 400 });
    }

    // Get the auth token from the request headers
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return new NextResponse('MISSING AUTH TOKEN', { status: 401 });
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_API_KEY) {
      console.error("STRIPE_API_KEY is not set");
      return new NextResponse('Stripe configuration missing', { status: 500 });
    }

    console.log("Stripe API key configured:", !!process.env.STRIPE_API_KEY);
    console.log("Creating Stripe checkout session...");

    // Create a simple checkout session using the existing Stripe config
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Course Enrollment',
              description: `Enrollment for course ${courseId}`,
            },
            unit_amount: 2000, // $20.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/courses/${courseId}?success=1`,
      cancel_url: `http://localhost:3000/courses/${courseId}?canceled=1`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
    });

    console.log("Stripe session created successfully:", session.id);

    return NextResponse.json({
      status: 'OK',
      success: true,
      url: session.url
    }, { status: 200 });

  } catch (error: any) {
    console.error("Frontend checkout API error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return new NextResponse(`Internal Server Error in checkout API: ${error.message}`, { status: 500 });
  }
}; 