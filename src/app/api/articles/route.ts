import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

// Get all articles
export const GET = async (req: NextRequest) => {
  try {
    const articles = await db.blog.findMany({});
    return NextResponse.json({
      success: true,
      data: articles,
    }, { status: 200 });
  } catch (error: any) {
    console.log('ERROR in fetching articles: ', error.message);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}