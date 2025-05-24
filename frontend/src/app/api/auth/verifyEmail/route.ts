import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  const { token } = reqBody;

  try {
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "[MISSING_BODY_PARAMS], Token is missing in body 👮‍♂️🚧  ...",
        },
        { status: 403 }
      );
    }

    console.log('Token from request body: ', token)

    const user = db.user.findFirst({
      where: {
        verifyToken: token,
        verifyTokenStatus: 'VALID',
        verifyTokenGenerationTime: {
          gte: Date.now().toString(),
        },
      },
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error,
        message:
          "[FAILED_TO_VERIFY_EMAIL], Internal server error 🤔🚨🚧, Something went wrong ...",
      },
      { status: 500 }
    );
  }
};
