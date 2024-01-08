import { PrismaClient } from "@prisma/client";

import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

// get user data
export const GET = async (req: NextRequest, { params }: { params: { userId: string }; }) => {
    try {
        const uid = params.userId;
        if (!uid) {
            return NextResponse
                .json({
                    status: false,
                    message: "Missing 'uid' in the request body.",
                }, { status: 400 });
        }

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

        return NextResponse
            .json({
                status: true,
                data: {
                    user,
                },
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

// delete account
export const DELETE = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    try {
        const uid = params.userId; // Use optional chaining to avoid errors

        if (!uid) {
            return NextResponse.json({
                status: false,
                message: "No user ID provided ...",
            }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: uid,
            },
        });

        if (!user) {
            return NextResponse.json({
                status: false,
                message: "No user found with this user ID ...",
            }, { status: 404 });
        }

        // Delete the user
        await prisma.user.delete({
            where: {
                id: uid,
            },
        });

        return NextResponse.json({
            status: true,
            message: "Account successfully deleted ...",
        }, { status: 200 });
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({
            status: false,
            error: error.message,
            message: "Internal server error ...",
        }, { status: 500 });
    }
};

