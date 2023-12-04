import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function middleware(request: NextRequest) {
    // const path = request.nextUrl.pathname;

    // const isPublicPath = path === '/login' || path === '/register' || path === '/';

    // const token = request.cookies.get('token')?.value || '';

    // if (!token && !isPublicPath) {
    //     // If there's no token and the path is not public, redirect to login
    //     return NextResponse.redirect(new URL('/login', request.nextUrl));
    // }

    // if (token && isPublicPath) {
    //     // If there's a token and the path is public, redirect to /browseCourses
    //     const uid = getTokenUid(token);
    //     return NextResponse.redirect(new URL(`/${uid}/browseCourses`, request.nextUrl));
    // }

    // // Redirect authenticated users to /browseCourses
    // if (token && !isPublicPath) {
    //     // If there's a token and the path is public, redirect to /browseCourses
    //     const uid = getTokenUid(token);
    //     return NextResponse.redirect(new URL(`/${uid}/browseCourses`, request.nextUrl));
    // } 
}

async function getTokenUid(token: string): Promise<string | null> {
    try {
        const response = await fetch('https://localhost:3000/api/auth/me', {
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
        console.error('Error fetching user data:', error);
        return null;
    }
}


export default authMiddleware({
    afterAuth(auth, req, evt) {
        // handle users who aren't authenticated
        if (!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({ returnBackUrl: req.url });
        }
        // redirect them to organization selection page
        if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/org-selection") {
            const orgSelection = new URL('/org-selection', req.url)
            return NextResponse.redirect(orgSelection)
        }
    },
    
    publicRoutes: ["/","/sign-in", "/sign-up", "/register", "/login", "/browseCourses", "/browseSessions"]
});

export const config = {
    matcher: [
        '/',
        '/register',
        '/login',
        '/profile/:path*',
        '/instructor/:path*',
        '/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'
    ],
}