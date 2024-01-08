import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';
// edit profile username and profile image url
export const PATCH = async (req: NextRequest, { params }: {
    params: {
        userId?: string;
    }
}) => {
    const userId = params.userId;
    const reqBody = await req.json();
    const { option, newUsername, newProfileImageUrl } = reqBody;
    let updatedUser;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return NextResponse
                .json({
                    status: false,
                    message: "No user found with this id.",
                }, { status: 404 });
        }

        if (option === 'Username') {
            if (!newUsername) {
                return NextResponse
                    .json({
                        status: false,
                        message: "username is required to update ...",
                    }, { status: 202 });
            }

            updatedUser = await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    name: newUsername,
                },
            });

            return NextResponse
                .json({
                    status: true,
                    data: updatedUser,
                    message: "User name successfully updated..",
                }, { status: 200 });
        }

        if (option === 'Image') {
            if (!newUsername) {
                return NextResponse
                    .json({
                        status: false,
                        message: "new profile image url is required to update ...",
                    }, { status: 202 });
            }

            updatedUser = await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    profileImageUrl: newProfileImageUrl,
                },
            });

            return NextResponse
                .json({
                    status: true,
                    data: updatedUser,
                    message: "User name successfully updated..",
                }, { status: 200 });
        }
    } catch (error) {
        return NextResponse
            .json({
                status: false,
                error: error,
                message: "Internal Server Error ...",
            }, { status: 500 });
    }
};