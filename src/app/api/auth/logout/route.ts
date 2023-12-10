import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export default async function DELETE(req: NextRequest, res: NextResponse) {
    
    const reqBody = await req.json();
    const { userId } = reqBody;
    
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: null,
                refreshTokenExpiry: null,
                refreshTokenStatus: "expired",
                accessToken: null,
                accessTokenExpiry: null,
                accessTokenStatus: "expired",
            },
        });

        NextResponse.next().headers.set("Authorization", ``);

        const response = NextResponse.json({
            status: true,
            data: updatedUser,
            message: "Logout Successfull 😶 ",
        }, { status: 200 });

        response.cookies.set("token", '');

        return response;
    } catch (error) {
        console.error(error);
        console.error("Error:", error);
        return NextResponse.json({
            status: false,
            error: error,
            message: "Failed to logout user ⚠👮‍♂️..",
        }, { status: 500 });
    }
};
