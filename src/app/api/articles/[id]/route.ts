import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest, { params }: {
  params: {
    id?: string;
  };
}) => {
  const articleId = params.id;
  try {
    if (!articleId) {
      console.log('article id not provided, articleId is required field ...')
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: 'article id not provided, articleId is required field ...'
      }, { status: 400 })
    }

    const article = await db.blog.findUnique({
      where: {
        id: articleId,
      }
    });

    if (!article) {
      console.log(`No article found with such articleId: ${articleId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `No article found with such articleId: ${articleId} ...`,
      }, { status: 404 })
    }

    return NextResponse.json({
      status: 'OK',
      success: true,
      data: article,
      message: `article info for articleId:${articleId}, fetched successfully ✔️ ...`
    }, { status: 200 });
  } catch (error: any) {
    console.log(`Failed to get article info for articleId:${articleId} ❌🚧 ...`);
    return NextResponse.json({
      status: 'ERROR',
      success: false,
      error: error.message,
      message: `Failed to get article info for articleId:${articleId} ❌🚧 ...`
    }, { status: 500 });
  }
}