import { NextRequest, NextResponse } from "next/server";
import { generateUid } from "@/helpers/id_helper";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { getDataFromToken } from "@/helpers/getDataFromToken";
dotenv.config();
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        if (!userId || !user) return NextResponse.redirect("/login");

        return NextResponse.json({ message: 'User found', data: user.id, });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}