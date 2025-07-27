import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Temporarily disabled for UI development
  return NextResponse.next();
}

// Keeping the config but commenting it out for future reference
/*
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
*/
