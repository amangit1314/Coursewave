import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

// become an instructor
export const POST = async (req: NextRequest, { params }: { params: { userId: string }; }) => {

    const uid = params.userId;
    // const reqBody = await req.json();
    // const { instructorTag } = reqBody;

    try {
        if (!uid) {
            return NextResponse.json({
                status: false,
                message: "User is not provided ...",
            }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: {
                id: uid,
            },
        });

        if (!user) {
            return NextResponse.json({
                status: false,
                message: `No user found with this uid: ${uid} ...`,
            }, { status: 404 });
        }

        if (!!user.isInstructor!) {
            return NextResponse.json({
                status: false,
                message: "You are already an instructor ...",
            }, { status: 402 });
        }

        const updatedUser = await db.user.update({
            where: { id: uid },
            data: {
                isInstructor: true,
            },
        });

        const createdInstructor = await db.instructor.create({
            data: {
                instructorID: uid,
                instructorName: updatedUser.name ?? updatedUser.email.split('@')[0],
                instructorEmail: updatedUser.email,
                instructorTag:  "Full Stack Engineer",
                instructorProfilePicUrl: updatedUser.profileImageUrl ?? "",
            },
        });

        console.log('Created Instructor: ', createdInstructor);

        return NextResponse.json({
            status: true,
            data: { updatedUser, createdInstructor },
            message: "You are an instructor now ✔️ ...",
        }, { status: 200 });

    } catch (error: any) {
        console.log('ERROR in becoming instructor, ERROR: ', error.message);
        return NextResponse.json({
            status: false,
            error: error.message,
            message: "Failed to become instructor ❌🚧...",
        }, { status: 500 });
    }
}