import { NextRequest, NextResponse } from "next/server";
import { getCookies } from "cookies-next";
import { SignJWT, jwtVerify } from "jose";
import { verifyToken } from "@/lib/helpers/jwt-helper";

const secretKey = process.env.JWT_SECRET!;
const key = new TextEncoder().encode(secretKey);

export const encrypt = async (payload: any) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(key);
};

export const decrypt = async (input: string): Promise<any> => {
  const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
  return payload;
};

export const getToken = async () => {
  const cookies = await getCookies();
  const token = cookies?.token;
  if (!token) return null;
  return await decrypt(token);
};

export const updateToken = async (req: NextRequest) => {
  const cookies = await getCookies();
  const token = cookies?.token;
  if (!token) return;

  const parsed = await decrypt(token);
  parsed.expires = new Date(Date.now() + 10 * 1000);

  const res = NextResponse.next();
  res.cookies.set({
    name: "token",
    value: await encrypt(parsed),
    expires: parsed.expires,
  });
  return res;
};

export const getUserIdFromToken = async (token: string) => {
  if (!token) return null;
  try {
    const result = await verifyToken(token);
    return result?.payload?.id; // Assuming user ID is stored in 'id' key of the payload
  } catch (error) {
    console.error("Error retrieving user ID from token:", error);
    return null;
  }
};

export const getUserIdFromRequest = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  return await getUserIdFromToken(token);
};
