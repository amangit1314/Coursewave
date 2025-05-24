import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { generateUid } from "@/helpers/id-helper";
import { sendEmail } from "@/helpers/send-email-helper";
import { NextRequest, NextResponse } from "next/server";
import { generateVerificationToken } from "@/helpers/jwt-helper";
import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
    await runMiddleware(req, NextResponse, cors);
    return new NextResponse('OK', { status: 200 });
}

export const dynamic = 'force-dynamic';

const isPasswordValid = (password: string) => {
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
};

export const POST = async (req: NextRequest) => {
    const reqBody = await req.json();
    const { email, password } = reqBody;

    console.log('Registeration request body: ', reqBody);

    try {
        if (!email || !password) {
            console.log('Email: ', email);
            console.log('Password: ', password);
            console.log("All fields are mandatory 👮‍♂️ ... ");

            return NextResponse.json({
                status: false,
                message: "All fields are mandatory 👮‍♂️ ... ",
            }, { status: 400 });
        }

        if (!isPasswordValid(password)) {
            return NextResponse.json({
                status: false,
                message: "Password must be at least 8 characters long with at least 1 number, 1 special character, 1 uppercase letter, and 1 lowercase letter.",
            }, { status: 400 });
        }

        const uuid4 = generateUid();
        console.log("Generated uid: ", uuid4);

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password: ", hashedPassword);

        const isUserAlreadyRegistered = await db.user.findUnique({
            where: { email },
        });

        if (isUserAlreadyRegistered) {
            console.log('Registeration ERROR: Authentication failed. There is already a user with these credentials 🔐👮‍♂️ ...');
            return NextResponse.json({
                status: false,
                message: "Authentication failed. There is already a user with these credentials 🔐👮‍♂️ ...",
            }, { status: 403 });
        }

        const createdUser = await db.user.create({
            data: {
                id: uuid4,
                email,
                name: email.split("@")[0],
                password: hashedPassword,
            },
        });

        const verificationToken = generateVerificationToken({ id: createdUser.id, email: createdUser.email, name: createdUser.name });

        sendEmail(
            email,
            "VERIFY",
            "Verify email address using SendGrid",
            "Click on below text to verify your account,and easy to continue to Coursewave",

            () => {
                console.log("Email sent 🗯📧 ");
                return NextResponse.json({
                    status: true,
                    data: {
                        id: createdUser.id,
                    },
                    message: "Registration Successful 🎉 + Verification email sent 👮‍♂️",
                }, { status: 200 });

            }
        );

        return NextResponse.json({
            status: true,
            data: {
                id: createdUser.id,
            },
            message: "Registration Successful 🎉",
        }, { status: 200 });
    } catch (error) {
        console.log('Registeration ERROR: ', error);
        return NextResponse.json({
            status: false,
            error: error,
            message: "Internal server error occurred ⚠👮‍♂️..",
        }, { status: 500 });
    }
};