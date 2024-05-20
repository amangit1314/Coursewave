import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

// change password
export const PATCH = async (req: NextRequest, { params }: { params: { userId?: string }; }) => {
    const uid = params?.userId;

    try {
        const reqBody = await req.json();
        const { oldPassword, newPassword } = reqBody;

        if (!uid || !oldPassword || !newPassword) {
            return NextResponse.json({
                status: false,
                message: "Missing required fields ...",
            }, { status: 422 });
        }

        const user = await db.user.findUnique({
            where: {
                id: uid,
            },
        });

        if (!user) {
            return NextResponse
                .json({
                    status: false,
                    message: `No user found with this id: ${uid}...`,
                }, { status: 404 });
        }

        //? Verify if the old password matches the stored hashed password
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return NextResponse.json({
                status: false,
                message: "Password didn't matched ...",
            }, { status: 401 });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedNewPassword,
            },
        });

        return NextResponse.json({
            status: true,
            data: updatedUser,
            message: "Password Successfully changed ...",
        }, { status: 500 });
    } catch (error) {
        return NextResponse.json({
            status: false,
            error: error,
            message: "Internal Server Error ...",
        }, { status: 500 });
    }
};