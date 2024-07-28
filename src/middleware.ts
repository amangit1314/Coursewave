import { NextRequest, NextResponse } from "next/server";
import { absoluteUrl } from "./utils/utils";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  const isPublicPath =
    path === "/login" ||
    path === "/register" ||
    path === "/verifyEmail" ||
    path == "/forgotPassword" ||
    path == "/resetPassword" ||
    path === "/" ||
    path === "/api/webhooks/stripe";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL(`/browseCourses`, request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

async function getTokenUid(token: string): Promise<string | null> {
  try {
    const response = await fetch("api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch user data. Status: ${response.status}`);
      return null;
    }

    const data = await response.json();

    const userId = data.userId;
    return userId;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/verifyEmail",
    "/forgotPassword",
    "/browseCourses",
    "/api/auth/me",
    "/api/webhooks/stripe",
    "/profile/:path*",
    "/instructor/:path*",
  ],
};
