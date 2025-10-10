import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;
  const { pathname } = request.nextUrl;

  // 🔒 Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      // No token -> redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Token exists -> allow access
    return NextResponse.next();
  }

  // 🔁 If already logged in, prevent visiting login/register
  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ✅ Continue normally
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
