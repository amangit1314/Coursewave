import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';
// change password
export const POST = async (req: NextRequest, { params: { uid } }: { params: { uid: string }; }) => {
    const reqBody = await req.json();
    const { oldPassword, newPassword } = reqBody;

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
            return;
        }

        // Verify if the old password matches the stored hashed password
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return NextResponse
                .json({
                    status: false,
                    message: "Password didn't matched ...",
                }, { status: 401 });
            return;
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedNewPassword,
            },
        });

        return NextResponse
            .json({
                status: true,
                data: updatedUser,
                message: "Password Successfully changed ...",
            }, { status: 500 });
    } catch (error) {
        return NextResponse
            .json({
                status: false,
                error: error,
                message: "Internal Server Error ...",
            }, { status: 500 });
    }
};