import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { db } from "@/lib/db";

//* GET user data
export const GET = async (req: NextRequest, { params }: { params: { userId: string }; }) => {
    try {
        const uid = params?.userId!;
        if (!uid) {
            return NextResponse
                .json({
                    status: false,
                    message: "Missing 'uid' in the request body.",
                }, { status: 400 });
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
                    message: `No user found with this id: ${uid} ...`,
                }, { status: 404 });
        }

        return NextResponse.json({
            status: true,
            data: user,
            message: "User details successfully accessed ✔️...",
        }, { status: 200 });
    } catch (error: any) {
        console.log(`ERROR in api/profile/[id]: ${error.message} `)
        return NextResponse
            .json({
                status: false,
                error: error,
                message: "Internal Server Error ...",
            }, { status: 500 });
    }
};

//* PUT update user account data
export const PUT = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    const uid = params?.userId!;
    const reqBody = await req.json();
    const { newUserName, newProfileImageUrl } = reqBody;

    try {
        if (!uid) {
            return NextResponse.json({
                status: false,
                message: "No user ID provided ...",
            }, { status: 400 });
        }

        if (!newUserName || !newProfileImageUrl) {
            return NextResponse.json({
                status: false,
                message: "No required fields (newUserName and newProfileImage) provided ...",
            }, { status: 400 });
        }

        const user = await db.user.findUnique({
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

        const updatedUser = await db.user.update({
            where: {
                id: uid,
            },
            data: {
                name: newUserName,
                profileImageUrl: newProfileImageUrl,
            }
        });

        return NextResponse.json({
            status: true,
            data: updatedUser,
            message: "Account successfully updated ✔️ ...",
        }, { status: 200 });
    } catch (error: any) {
        console.log('ERROR in updating account: ', error.message);
        return NextResponse.json({
            status: false,
            error: error.message,
            message: "Internal server error ❌🚧 ...",
        }, { status: 500 });
    }
};

//* DELETE user account data
export const DELETE = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    try {
        const uid = params.userId;

        if (!uid) {
            return NextResponse.json({
                status: false,
                message: "No user ID provided ...",
            }, { status: 400 });
        }

        const user = await db.user.findUnique({
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

        await db.user.delete({
            where: {
                id: uid,
            },
        });

        return NextResponse.json({
            status: true,
            message: "Account successfully deleted ...",
        }, { status: 200 });
    } catch (error: any) {
        console.log('ERROR in deleting account: ', error.message);
        return NextResponse.json({
            status: false,
            error: error.message,
            message: "Internal server error ...",
        }, { status: 500 });
    }
};