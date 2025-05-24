import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}
export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest, { params }: {
  params: {
    id: string;
  };
}) => {
  const articleId = params?.id!;

  try {
    if (!articleId) {
      console.log('[MISSING PARAMETERS] article id not provided, articleId is required field ...')
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: '[MISSING PARAMETERS], article id not provided, articleId is required field ...'
      }, { status: 400 })
    }

    const article = await db.blog.findUnique({
      where: {
        id: articleId,
      }
    });

    if (!article) {
      console.log(`[NOT FOUND], No article found with such articleId: ${articleId} ...`)
      return NextResponse.json({
        status: 'ERROR',
        success: false,
        message: `[NOT FOUND], No article found with such articleId: ${articleId} ...`,
      }, { status: 404 })
    }

    return NextResponse.json({
      status: 'OK',
      success: true,
      data: article,
      message: `[SUCCESS], article info for articleId:${articleId}, fetched successfully ✔️ ...`
    }, { status: 200 });
  } catch (error: any) {
    console.log(`[ARTICLE FOUND ERROR], Failed to get article info for articleId:${articleId}, ERROR: ${error.message} ❌🚧 ...`);
    return NextResponse.json({
      status: 'ERROR',
      success: false,
      error: error.message,
      message: `[ARTICLE FOUND ERROR], Failed to get article info for articleId:${articleId} ❌🚧 ...`
    }, { status: 500 });
  }
}