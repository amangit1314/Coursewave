import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// import { NextApiResponse } from "next";
export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

// export default function handler(req: NextRequest, res: NextApiResponse) {
//     if (req.method === 'POST') {
//         POST(req); // Call the POST handler
//     } else {
//         res.status(405).json({ message: 'Method not allowed' }); // Handle other HTTP methods
//     }
// }


export const POST = async (req: NextRequest) => {
    try {
        const reqBody = await req.json();
        const { userId, courseId, quantity } = reqBody;

        // Generate a unique cart item ID based on the user and course
        const cartItemId = `${userId}_${courseId}`;

        // Check if the cart item already exists for the user
        const existingCartItem = await prisma.cartItem.findUnique({
            where: {
                id: cartItemId,
            },
        });

        if (existingCartItem) {
            // If the cart item already exists, update the quantity
            const updatedCartItem = await prisma.cartItem.update({
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
                message: "Cart item quantity updated successfully",
            });
        } else {
            // If the cart item doesn't exist, create a new cart item
            const newCartItem = await prisma.cartItem.create({
                data: {
                    id: cartItemId,
                    userId: userId,
                    courseId: courseId,
                    quantity: quantity,
                },
            });

            return NextResponse.json({
                success: true,
                data: newCartItem,
                message: "Cart item added successfully",
            });
        }
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            message: "Failed to add item to the cart",
        });
    }
};
