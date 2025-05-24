// pages/api/preferences/route.ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params?.userId!;
    const { preferences } = await request.json();

    if (!userId || !preferences) {
      return NextResponse.json(
        { message: "User ID and preferences are required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { preferences },
    });

    return NextResponse.json(
      { message: "Preferences updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
