import bcrypt from "bcrypt";

import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/send_email_helper";
import { generateResetToken } from "@/helpers/jwt_helper";
import { forgotPasswordHtmlTemplate } from "@/helpers/forgot_password_email_html";

import { db } from "@/lib/db";
import cors, { runMiddleware } from '@/lib/cors';
import Email from "next-auth/providers/email";

export async function OPTIONS(req: NextRequest) {
    await runMiddleware(req, NextResponse, cors);
    return new NextResponse('OK', { status: 200 });
}

export const dynamic = 'force-dynamic';

// api endpoint to generate reset token and send forgot password email
export const POST = async (req: NextRequest) => {
    const reqBody = await req.json();
    const { email } = reqBody;

    try {
        if (!email) {
            return NextResponse.json({
                status: false,
                message: "Missing Fields, User email is missing ... ",
            }, { status: 402 });
        }

        const user = await db.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({
                status: false,
                message: "Authentication failed. User not found ... ",
            }, { status: 404 });
        }

        const resetToken = generateResetToken(email);
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

        const resetPasswordUrl = `https://coursewave.in/resetPassword?resetToken=${resetToken}`;
        const logoUrl = 'https://wcgwzdehnxpexussrkni.supabase.co/storage/v1/object/public/assets/coursewave-high-resolution-color-logo.png';

        sendEmail(
            email,
            "RESET",
            "Password Reset Request",
            forgotPasswordHtmlTemplate(process.env.NEXT_DEPLOYMENT_APP_URL!, resetPasswordUrl, email, logoUrl),
            () => {
                console.log('Reset Password Token: ', resetToken);
                return NextResponse.json({
                    status: true,
                    message: "Password reset email sent. ",
                }, { status: 200 });
            }
        );

        return NextResponse.json({
            status: true,
            message: "Password reset email sent ...",
        }, { status: 200 });
    } catch (error) {
        console.error('[FORGOT_PASSWORD_ERROR]: ', error);
        return NextResponse.json({
            status: false,
            error: error,
            message: "Failed to send reset email ⚠...",
        }, { status: 500 });
    }
};

// api endpoint to update the user password
export const PATCH = async (req: NextRequest) => {
    const reqBody = await req.json();
    const { token, newPassword } = reqBody;

    try {
        if (!newPassword || !token) {
            return NextResponse.json({
                status: false,
                message: "[MISSING_REQUIRED_FIELDS], missing password or token ... ",
            }, { status: 402 });
        }

        const user = await db.user.findFirst({
            where: {
                resetToken: token
            }
        });

        if (!user) {
            return NextResponse.json({
                status: false,
                message: "Authentication failed. User not found ... ",
            }, { status: 404 });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        console.log("Hashed new password: ", hashedNewPassword);

        await db.user.update({
            where: {
                email: user.id,
            },
            data: {
                password: hashedNewPassword,
                resetToken: '',
                resetTokenStatus: 'EXPIRED',
                resetTokenExpiry: Date.now().toString(),
            }
        });

        return NextResponse.json({
            status: true,
            message: "Password successfully changed ...",
        }, { status: 200 });
    } catch (error) {
        console.error('[FORGOT_PASSWORD_UPDATE_PASSWORD_ERROR]: ', error);
        return NextResponse.json({
            status: false,
            error: error,
            message: "Failed to send reset email ⚠...",
        }, { status: 500 });
    }
}