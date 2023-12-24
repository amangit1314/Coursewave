import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";

const prisma = new PrismaClient();

export default function handler(req: NextRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        POST(req); 
    } else if (req.method === 'GET') {
        GET(req);
     }
    else if (req.method === 'PUT') { 
        POST(req);
    }
    else if (req.method === 'DELETE') { 
        DELETE(req);
    }
    else {
        res.status(405).json({ message: 'Method not allowed' }); // Handle other HTTP methods
    }
}



// Get all categories
export const GET = async (req: NextRequest) => {
    // return await fetch(`${process.env.NEXT_PUBLIC_API}/categorys`)
    try {
        const categories = await prisma.category.findMany({});
        return NextResponse.json({
            success: true,
            data: categories,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}

// Add a category
export const POST = async (req: NextRequest) => {
    const reqBody = await req.json();
    const { categoryName } = reqBody;

    try {
        if (!categoryName) {
            return NextResponse.json({
                success: false,
                error: 'category name is required fields',
            }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: {
                categoryName: categoryName,
            }
        });

        return NextResponse.json({
            success: true,
            data: category,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}

// Edit a category
export const PUT = async (req: NextRequest) => {
    const reqBody = await req.json();
    const { categoryName, newCategoryName } = reqBody;

    try {

        if (!categoryName || !newCategoryName) {
            return NextResponse.json({
                success: false,
                error: 'category name and new category name are required fields',
            }, { status: 400 });
        }

        const category = await prisma.category.findUnique({
            where: {
                categoryName: categoryName,
            },
        })

        if (!category) {
            return NextResponse.json({
                success: false,
                error: 'There is no category found with this name',
            }, { status: 404 });
        }

        const updatedCategory = await prisma.category.update({
            where: {
                categoryName: categoryName,
            },
            data: {
                categoryName: newCategoryName
            }
        });

        return NextResponse.json({
            success: true,
            data: updatedCategory,
            message: `Category ${categoryName} successfully upgraded ...`
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}

// Delete a category
export const DELETE = async (req: NextRequest) => {
    const reqBody = await req.json();
    const { categoryName } = reqBody;

    try {
        if (!categoryName) {
            return NextResponse.json({
                success: false,
                error: 'category name is a required field',
            }, { status: 400 });
        }

        const category = await prisma.category.findUnique({
            where: {
                categoryName: categoryName,
            },
        });

        if (!category) {
            return NextResponse.json({
                success: false,
                error: 'There is no category found with this name',
            }, { status: 404 });
        }

        await prisma.category.delete({
            where: {
                categoryName: categoryName,
            },
        });

        return NextResponse.json({
            success: true,
            message: `Category ${categoryName} successfully deleted`,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}
