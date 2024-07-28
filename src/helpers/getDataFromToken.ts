import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("accessToken")?.value || "";

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRECT_KEY!);

    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getDataFromRefreshToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("refreshtoken")?.value || "";

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);

    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
