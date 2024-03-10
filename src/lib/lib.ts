// // import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// import { SignJWT, jwtVerify } from 'jose';
// import { db } from "./db";
// import { getCookies } from "cookies-next";

// const secretKey = process.env.SECRECT_KEY!;
// const key = new TextEncoder().encode(secretKey);

// export async function encrypt(payload: any) {
//   return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('10 sec from now').sign(key);
// }

// export async function decrypt(input: string): Promise<any> {
//   const { payload } = await jwtVerify(input, key, {
//     algorithms: ['HS256']
//   });
//   return payload;
// }

// export async function getToken() {
//   // const token = cookies().get('token')?.value;
//   const token = document.cookie;
//   if (!token) return null;
//   return await decrypt(token);
// }

// export async function updateToken(req: NextRequest) {
//   const token = await req.cookies.get('token')?.value;
//   if (!token) return;

//   const parsed = await decrypt(token);
//   parsed.expires = new Date(Date.now() + 10 * 1000);
//   const res = NextResponse.next();
//   res.cookies.set({
//     name: 'token',
//     value: await encrypt(parsed),
//     expires: parsed.expires,
//   });
//   return res;
// }

// export async function getUserById(id: string) {
//   try {
//     const uid = id;
//     const user = await db.user.findUnique({
//       where: {
//         id: uid
//       }
//     });

//     if (!user) {
//       throw new Error(`No user found with this id: ${uid}`)
//     }

//     return user;
//   } catch (error) {
//     throw new Error(`Failed to get user info by id: ${id}, Error: ${error}`)
//   }

// }