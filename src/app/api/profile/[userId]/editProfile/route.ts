import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// edit profile
export const POST = async (req: NextRequest) => {
    const reqBody = await req.json();
    const { uid, data } = reqBody;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: uid,
            },
        });

        if (!user) {
            return NextResponse
                .json({
                    status: false,
                    message: "No user found with this id.",
                }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: data,
        });

        return NextResponse
            .json({
                status: true,
                data: updatedUser,
                message: "User details successfully accessed..",
            }, { status: 200 });
    } catch (error) {
        return NextResponse
            .json({
                status: false,
                error: error,
                message: "Internal Server Error ...",
            }, { status: 500 });
    }
};