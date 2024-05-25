import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateUid } from "@/helpers/id_helper";
import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  try {
    const articles = await db.blog.findMany();
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

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  const { authorId, title, content, estimatedReadingTime, thumbnailUrl } = reqBody;
  const id = generateUid();
  const blogId = `article_${id.split('-')[0]}`;

  try {
    if (!authorId || !title || !content || !estimatedReadingTime ) {
      return NextResponse.json({
        success: false,
        message: '[MISSING REQUIRED FIELDS], missing authorId or title or content or estimatedReadingTime or thumbnailUrl ... ',
      }, { status: 402 });
    }

    const user = await db.user.findUnique({
      where: {
        id: authorId,
      }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: '[NOT FOUND], user not found with this authorId ... ',
      }, { status: 404 });
    }

    const createdBlog = await db.blog.create({
      data: {
        id: blogId,
        title: title,
        content: content,
        estimatedReadingTime: estimatedReadingTime,
        clapsCount: 0,
        authorId: authorId,
        thumbnailUrl: thumbnailUrl,
        isRecommended: false,
      }
    });

    return NextResponse.json({
      success: true,
      data: createdBlog,
      message: '[WRITE ARTICLE SUCCESS], article created successfully ✔️🎉 ... ',
    }, { status: 500 });

  } catch (error: any) {
    console.log('[WRITE ARTICLE ERROR], failed to write an article ❌🚧 ... ', error.message);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: '[WRITE ARTICLE ERROR], failed to write an article ❌🚧 ... ',
    }, { status: 404 });
  }
}