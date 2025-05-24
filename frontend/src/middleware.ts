import { NextRequest, NextResponse } from "next/server";

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
    path === "/api/webhooks/stripe" || path === "/profile";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL(`/browse`, request.url));
  }

  if (!isPublicPath && !token && path != '/browse') {
    return NextResponse.redirect(new URL("/login", request.url));
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
