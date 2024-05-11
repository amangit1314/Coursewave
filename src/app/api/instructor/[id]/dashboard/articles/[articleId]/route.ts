import { NextRequest, NextResponse } from "next/server";
import { generateUid } from "@/helpers/id_helper";
import { db } from "@/lib/db";
import dotenv from "dotenv";
dotenv.config();

export const dynamic = 'force-dynamic';

//? create an article
export const POST = async (req: NextRequest, { params }: {
  params: {
    id?: string;
  };
}) => {

  const authorId = params?.id;

  const reqBody = await req.json();
  const { title, content, estimatedReadingTime } = reqBody;

  try {
    const articleId = `article_${generateUid().split("-")[0]}`;

    if (!authorId) {
      return NextResponse.json({ success: false, message: "Invalid Instructor Id" }, { status: 400 });
    }

    if (!title || !content || !estimatedReadingTime) {
      return NextResponse.json({ success: false, message: "Missing required fields ..." }, { status: 422 });
    }

    const createdArticle = await db.blog.create({
      data: {
        id: articleId,
        title,
        content,
        authorId: authorId,
        estimatedReadingTime,
      }
    });

    return NextResponse.json({
      success: true,
      data: createdArticle,
      message: 'Article Successfully Created ...',
    }, { status: 200 });
  } catch (error: any) {
    console.error('ERROR inside instructor/id/dashboard/articles: ', error.message)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Internal Server Error, Failed to create a article ...',
    }, { status: 500 });
  }
}

//* get all created articles by authorId [WORKING]
export const GET = async (req: NextRequest, { params }: {
  params: {
    id?: string;
  };
}) => {
  const authorId = params?.id;
  try {
    if (!authorId) {
      return NextResponse.json({
        success: false,
        message: "Author Id not provided ...",
      }, { status: 400 });
    }

    console.log(`AuthorID :-> ${authorId}`)

    const author = await db.user.findUnique({
      where: {
        id: authorId
      },
      select: {
        id: true,
        email: true,
        profileImageUrl: true,
        isEmailVerified: true,
        wishList: true,
        blogs: true,
        blogComments: true,
      }
    });

    if (!author) {
      return NextResponse.json({
        success: false,
        message: "No Author found with Provided Id ❌ ..."
      }, { status: 404 });
    }

    console.log(`Created articles by authorId:-> ${authorId}: `, author.blogs);
    return NextResponse.json({
      success: true,
      data: author.blogs,
      message: 'Articles fetched successfully ...',
    }, { status: 200 });
  } catch (error: any) {
    console.log('Internal Server error in instructor/[id]/articles: ', error.message);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: `Internal Server Error, Failed to get created articles for this id: ${authorId} ...`,
    }, { status: 500 });
  }
};