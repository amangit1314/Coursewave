import { generateAccessToken } from "@/helpers/jwt_helper";
import { NextRequest, NextResponse } from "next/server";

// refresh token
export const POST = async (req: NextRequest) => {
    const reqBody = await req.json();
    const { uid, name, email } = reqBody;

    const newAccessToken = generateAccessToken({
        id: uid,
        name: name,
        email: email,
    });

    return NextResponse
        .json({
            status: true,
            data: {
                newAccessToken,
            },
            message: "User details successfully accessed..",
        }, { status: 200 });
};