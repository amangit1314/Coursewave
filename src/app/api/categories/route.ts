import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
export const dynamic = 'force-dynamic';

// Get all categories
export const GET = async (req: NextRequest) => {
    // return await fetch(`${process.env.NEXT_PUBLIC_API}/categorys`)
    try {
        const categories = await db.category.findMany({});
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

        const category = await db.category.create({
            data: {
                name: categoryName,
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

        const category = await db.category.findUnique({
            where: {
                name: categoryName,
            },
        })

        if (!category) {
            return NextResponse.json({
                success: false,
                error: 'There is no category found with this name',
            }, { status: 404 });
        }

        const updatedCategory = await db.category.update({
            where: {
                name: categoryName,
            },
            data: {
                name: newCategoryName
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

        const category = await db.category.findUnique({
            where: {
                name: categoryName,
            },
        });

        if (!category) {
            return NextResponse.json({
                success: false,
                error: 'There is no category found with this name',
            }, { status: 404 });
        }

        await db.category.delete({
            where: {
                name: categoryName,
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
