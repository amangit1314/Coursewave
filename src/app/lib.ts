import { NextRequest, NextResponse } from "next/server";
import { getCookies } from "cookies-next";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/helpers/jwt_helper";

const secretKey = process.env.JWT_SECRET!;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("10 sec from now").sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
  return payload;
}

export async function getToken() {
  const cookies = getCookies();
  const token = cookies.token;
  if (!token) return null;
  return await decrypt(token);
}

export async function updateToken(req: NextRequest) {
  const cookies = getCookies();
  const token = cookies.token;
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
}

export async function getUserIdFromToken(token: string) {
  if (!token) return null;
  try {
    const payload = await verifyToken(token);
    // return payload?.id; // Assuming user ID is stored in 'id' key of the payload
  } catch (error) {
    console.error("Error retrieving user ID from token:", error);
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const uid = id;
    const user = await db.user.findUnique({
      where: {
        id: uid
      }
    });

    if (!user) {
      throw new Error(`No user found with this id: ${uid}`)
    }

    return user;
  } catch (error) {
    throw new Error(`Failed to get user info by id: ${id}, Error: ${error}`)
  }

}