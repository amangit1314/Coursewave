import { NextApiRequest } from "next";

export default interface CustomRequest extends NextApiRequest {
    token: string | object; // Adjust the type of 'token' as needed
    refreshTokenPayload: string | object;
}