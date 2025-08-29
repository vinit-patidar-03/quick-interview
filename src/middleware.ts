import { NextResponse, NextRequest } from 'next/server';

const urls = ["/", "/sign-in", "/sign-up"];

const protectedRoutes = ["/practice", "/browse", "/create", "/profile", "/playground/:path*"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const rtoken = request.cookies.get("refreshToken")?.value;
    const { pathname } = request.nextUrl;
    
    console.log("Middleware check:", { pathname, token, rtoken });

  if ((token || rtoken) && urls.includes(pathname)) {
    return NextResponse.redirect(new URL("/practice", request.url));
  }

  if (!token && !rtoken && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    
    return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/interviews/:path*",
    "/api/auth/:path*",
    "/create",
    "/browse",
    "/practice",
    "/profile",
    "/playground/:path*",
    "/",
    "/sign-in",
    "/sign-up",
  ],
};
