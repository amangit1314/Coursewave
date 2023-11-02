import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// become an instructor
export const POST = async (req: NextRequest, { params }: { params: { userId: string }; }) => {

    const uid = params.userId;
    try {
        if (!uid) {
            return NextResponse
                .json({
                    status: false,
                    message: "User is not authenticated ...",
                }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: uid,
            },
        });

        if (user && user.isInstructor) {
            return NextResponse
                .json({
                    status: false,
                    message: "You are already an instructor ...",
                }, { status: 403 });
        } else {
            const updatedUser = await prisma.user.update({
                where: { id: uid },
                data: {
                    isInstructor: true,
                },
            });

            const createdInstructor = await prisma.instructor.create({
                data: {
                    instructorID: uid,
                    instructorName: updatedUser.name!,
                    instructorEmail: updatedUser.email,
                    instructorTag: "",
                    instructorProfilePicUrl: "",
                },
            });

            return NextResponse
                .json({
                    status: true,
                    data: { updatedUser, createdInstructor },
                    message: "You are an instructor now ...",
                }, { status: 200 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse
            .json({
                status: false,
                error: error,
                message: "You are an instructor now ...",
            }, { status: 500 });
    }
}