import bcrypt from "bcrypt";

import { generateResetToken } from "@/helpers/jwt_helper";
import { sendEmail } from "@/helpers/send_email_helper";
import { NextRequest, NextResponse } from "next/server";
import { forgotHtml } from "@/helpers/forgot_password_email_html";
import { NextApiResponse } from "next";

import { db } from "@/lib/db";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';



export const POST = async (req: NextRequest) => {
    try {
        const reqBody = await req.json();
        const { email } = reqBody;

        const user = await db.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({
                status: false,
                message: "Authentication failed. User not found ",
            }, { status: 404 });
        }

        const resetToken = generateResetToken(email); // Assuming you have a helper for generating reset tokens
        const hashedResetToken = await bcrypt.hash(resetToken as string, 10);

        const resetTokenExpiration = new Date();
        resetTokenExpiration.setHours(resetTokenExpiration.getHours() + 1); // Expires in 1 hour

        await db.user.update({
            where: { email },
            data: {
                resetTokenGenerationTime: new Date(),
                resetToken: hashedResetToken,
                resetTokenExpiry: resetTokenExpiration.toString(),
                resetTokenStatus: "valid",
            },
        });
        const localhost = 'http://192.168.1.3:3000';
        const resetPasswordUrl = `http://192.168.1.3:3000/forgotPassword`;
        const emailText = `Click here to reset your password`;
        const logoUrl = 'https://wcgwzdehnxpexussrkni.supabase.co/storage/v1/object/public/assets/coursewave-high-resolution-color-logo.png';
        const forgotPasswordhtml = `<p>
            <h2 style=" font-weight: bold; font-size: 18px;">Reset your CourseWave password</h2>
            <a style="text decoration:underline;" href="${resetPasswordUrl}">${emailText}</a>
            <br>
            <a style="font-size: 12px; padding-top: 20px ; color: #808080;">If you didn't request a reset, don't worry. You can safely ignore this email.</a>
            <br>
            <a style="font-weight: bold; padding-top: 10px ;font-size: 10px; color: #10101081;">CourseWave</a>
            </p>`;
        sendEmail(
            email,
            "Password Reset Request",
            emailText,
            // forgotHtml(siteUrl, resetPasswordUrl, email, logoUrl),
            forgotPasswordhtml,
            () => {
                console.log(resetPasswordUrl, resetToken);
                return NextResponse.json({
                    status: true,
                    message: "Password reset email sent. ",
                }, { status: 200 });
            }
        );

        return NextResponse.json({
            status: true,
            message: "Password reset email sent ...",
        }, { status: 500 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: false,
            error: error,
            message: "Failed to send reset email ⚠...",
        }, { status: 500 });
    }
};
