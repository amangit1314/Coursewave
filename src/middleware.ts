import { NextRequest, NextResponse } from "next/server";
import { absoluteUrl } from "./utils/utils";
export { default } from "next-auth/middleware";
// import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
    const token = request.cookies.get("token")?.value || "";
  // const token = await getToken({ req: request });

  const isPublicPath =
    path === "/login" ||
    // path.includes("/login") ||
    path === "/register" ||
    // path.includes("/register") ||
    path === "/verifyEmail" ||
    // path.includes("/verifyEmail") ||
    path === "/" ||
    path === "/api/webhooks/stripe";

  //* If there's token and the path is public && user, redirect to /browseCourses
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL(`/browseCourses`, request.url));
  }

  //! If there's no token and the path is not public, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

async function getTokenUid(token: string): Promise<string | null> {
  try {
    const response = await fetch(("api/auth/me"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle non-OK responses, e.g., unauthorized
      console.error(`Failed to fetch user data. Status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    // Assuming the response has a user ID property, modify this based on your actual response structure
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
