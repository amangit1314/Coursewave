import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest) => {
    try {
        const reqBody = await req.json();
        const { userId, courseId, quantity } = reqBody;
        const cartItemId = `${userId}_${courseId}`;

        const course = await db.course.findUnique({
            where: {
                courseId,
            }
        })

        if (!course) {
            return NextResponse.json({
                success: false,
                message: "No course found with this id ...",
            });
        }

        const existingCartItem = await db.cartItem.findUnique({
            where: {
                id: cartItemId,
            },
        });

        if (existingCartItem) {
            const updatedCartItem = await db.cartItem.update({
                where: {
                    id: cartItemId,
                },
                data: {
                    quantity: existingCartItem.quantity + quantity,
                },
            });

            return NextResponse.json({
                success: true,
                data: updatedCartItem,
                message: "Cart item quantity updated successfully ✔️ ...",
            });
        } else {
            const newCartItem = await db.cartItem.create({
                data: {
                    id: cartItemId,
                    userId: userId,
                    courseId: courseId,
                    courseName: course.courseTitle,
                    courseInstructorName: course.courseCreator,
                    coursePrice: course.coursePrice,
                    quantity: quantity,
                },
            });

            return NextResponse.json({
                success: true,
                data: newCartItem,
                message: "Cart item added successfully ...",
            });
        }
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: "Failed to add item to the cart ...",
        });
    }
};

export const PATCH = async (req: NextRequest, { params }: { params: { cartItemId: string } }) => {
    try {
        const cartItemId = params.cartItemId;

        const deletedCartItem = await db.cartItem.delete({
            where: {
                id: cartItemId,
            },
        });

        if (!deletedCartItem) {
            return NextResponse.json({
                success: false,
                message: "No cart item found with this id ...",
            });
        }

        return NextResponse.json({
            success: true,
            message: "Cart item deleted successfully ...",
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: "Failed to delete cart item ...",
        });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        await db.cartItem.deleteMany({}); // Delete all cart items

        return NextResponse.json({
            success: true,
            message: "All cart items removed successfully ...",
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: "Failed to remove all cart items ...",
        });
    }
};

export const PUT = async (req: NextRequest, { params }: { params: { cartItemId: string } }) => {
    try {
        const cartItemId = params.cartItemId;
        const reqBody = await req.json();
        const { quantity } = reqBody;

        const updatedCartItem = await db.cartItem.update({
            where: {
                id: cartItemId,
            },
            data: {
                quantity: quantity,
            },
        });

        if (!updatedCartItem) {
            return NextResponse.json({
                success: false,
                message: "No cart item found with this id ...",
            });
        }

        return NextResponse.json({
            success: true,
            data: updatedCartItem,
            message: "Cart item quantity updated successfully ✔️ ...",
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: "Failed to update cart item quantity ...",
        });
    }
};
