import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (payload: any) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });
    return token;
};

export const generateRefreshToken = (payload: any) => {
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET as string, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });
    return refreshToken;
};

export const generateVerificationToken = (email: string) => {
    try {
        const secretKey = process.env.JWT_SECRET;
        const verificationToken = jwt.sign({ email }, secretKey as string, {
            expiresIn: "1h",
        });
        return verificationToken;
    } catch (error: any) {
        console.log(error.message);
    }
};

export const generateResetToken = (email: string) => {
    try {
        const secretKey = process.env.JWT_SECRET;
        const resetToken = jwt.sign({ email }, secretKey as string, { expiresIn: "1h" });
        return resetToken;
    } catch (error: any) {
        console.log(error.message);
    }
};
