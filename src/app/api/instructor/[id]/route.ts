import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: {
    params: {
        id?: string;
    };
}) {
    const instructorId = params?.id;
  
    try {
        if (!instructorId) {
            return NextResponse.json({
                success: false,
                data: false,
                message: "No Instructor Id Provided ⚠ ..."
            }, { status: 400 });
        }      

        const foundedInstructor = await prisma.instructor.findUnique({
            where: {
                instructorID: instructorId
            }
        });

        if (!foundedInstructor) {
            return NextResponse.json({
                success: false,
                data: false,
                message: "No Instructor found with Provided Id ❌ ..."
            }, { status: 404 });

        }

        return NextResponse.json({
            success: true,
            data: true,
            message: "Provided Instructor Id is correct ✔..."
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal server error ❌ ..."
        }, { status: 500 });
    }
}