import { generateAccessToken } from "@/helpers/jwt-helper";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

// refresh token
export const POST = async (req: NextRequest, { params }: {
    params: {
        userId?: string;
    };
}) => {
    try {
        const uid = params.userId;
        const reqBody = await req.json();

        const { name, email } = reqBody;

        const newAccessToken = await generateAccessToken({
            id: uid,
            name: name,
            email: email,
        });

        console.log('New Access Token', newAccessToken)

        return NextResponse.json({
            status: true,
            data: newAccessToken,
            message: "User details successfully accessed..",
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            status: true,
            error: error.message,
            message: "Failed to access user details ...",
        }, { status: 500 });
    }
};

/**
 * try {
  const newAccessToken = await generateAccessToken({
    id: uid,
    name: name,
    email: email,
  });

  console.log('New Access Token', newAccessToken);

  return NextResponse.json({
    status: true,
    data: newAccessToken,
    message: "User details successfully accessed..",
  }, { status: 200 });
} catch (error) {
  console.error("Error generating access token:", error);
  return NextResponse.json({
    status: false,
    error: "Failed to generate access token",
    message: "User details access failed",
  }, { status: 500 });
}

 */