import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateVerificationToken } from "@/helpers/jwt_helper";
import { sendEmail } from "@/helpers/send_email_helper";
import { generateUid } from "@/helpers/id_helper";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const isPasswordValid = (password: string) => {
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
};

export const POST = async (req: NextRequest) => {
    const reqBody = await req.json();
    const { email, password } = reqBody;

    console.log(reqBody);
    
    if (!email || !password) {
       return NextResponse.json({
            status: false,
            message: "All fields are mandatory 👮‍♂️ ",
        }, { status: 400 });
    }

    if (!isPasswordValid(password)) {
        return NextResponse.json({
            status: false,
            message: "Password must be at least 8 characters long with at least 1 number, 1 special character, 1 uppercase letter, and 1 lowercase letter.",
        }, { status: 400 });
    }

    try {
        const uuid4 = generateUid();
        console.log("Generated uid: ", uuid4);

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password: ", hashedPassword);

        const isUserAlreadyRegistered = await prisma.user.findUnique({
            where: { email },
        });

        if (isUserAlreadyRegistered) {

           return NextResponse.json({
                status: false,
                message: "Authentication failed. There is already a user with these credentials 🔐👮‍♂️ ...",
            }, { status: 403 });
        }

        const createdUser = await prisma.user.create({
            data: {
                id: uuid4,
                email,
                name: email.split("@")[0],
                password: hashedPassword,
            },
        });

        const verificationToken = generateVerificationToken(email);

        sendEmail(
            email,
            "Verify email address using SendGrid",
            "Click on below text to verify your account,and easy to do anywhere, even with Node.js",
            `<a href="${verificationToken}"> Click to Verify</a>`,
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
        console.log(error);
        return NextResponse.json({
            status: false,
            error: error,
            message: "Internal server error occurred ⚠👮‍♂️..",
        }, { status: 500 });
    }
};