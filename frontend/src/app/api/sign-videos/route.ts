import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
    //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    cloud_name: 'df2g8tcxq' as string,
    api_key: process.env.CLOUDINARY_API_KEY! as string,
    api_secret: process.env.CLOUDINARY_API_SECRET! as string,
    secure: true,
});

export const POST = async (req: NextRequest) => {
    const body = (await req.json()) as { paramsToSign: Record<string, string> };
    const { paramsToSign } = body;

    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET! as string);
    console.log('Signature after signing in: ', signature);
    return Response.json({ signature });
    // return NextResponse.json({ success: true, status: 'OK', data: '' }, { status: 200 });
}