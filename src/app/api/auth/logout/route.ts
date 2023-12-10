import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const userId = req.body; // Assuming userId is passed in the request body

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshToken: null,
                refreshTokenExpiry: null,
                refreshTokenStatus: "expired",
                accessToken: null,
                accessTokenExpiry: null,
                accessTokenStatus: "expired",
            },
        });

        res.setHeader("Authorization", ""); // Use setHeader to clear the Authorization header

        // To clear cookies, if needed, uncomment the following lines:
        // res.setHeader(
        //   "Set-Cookie",
        //   "token=; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure"
        // );

        res.status(200).json({
            status: true,
            data: updatedUser,
            message: "Successfully logged out",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to logout user" });
    }
};
