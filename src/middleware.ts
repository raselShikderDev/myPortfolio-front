/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface decoded {
  id: number;
  email: string;
  role: "OWNER";
  iat: number;
  exp: number;
}

export async function middleware(request: NextRequest) {
  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;
  const { pathname } = request.nextUrl;
  // console.log(token);

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  try {
    const decoded = jwt.verify(token as string, process.env.JWT_ACCESS_SECRET as string);
    console.log('decoded: ', decoded);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }
  // if ((pathname === "/login" || pathname === "/register") && token) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(request: NextRequest) {
//   const token =
//     request.cookies.get("accessToken")?.value ||
//     request.cookies.get("next-auth.session-token")?.value ||
//     request.cookies.get("__Secure-next-auth.session-token")?.value;

//   const { pathname } = request.nextUrl;

//   if (pathname.startsWith("/dashboard")) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }

//     try {
//       jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
//       return NextResponse.next();
//     } catch (error) {
//       console.error("JWT verification failed:", error);
//       const response = NextResponse.redirect(new URL("/login", request.url));
//       response.cookies.delete("accessToken");
//       return response;
//     }
//   }

//   if (pathname === "/login" || pathname === "/register") {
//     if (token) {
//       try {
//         jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
//         return NextResponse.redirect(new URL("/dashboard", request.url));
//       } catch {
//         return NextResponse.next();
//       }
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/login", "/register"],
// };

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// interface Decoded {
//   id: number;
//   email: string;
//   role: string;
//   iat: number;
//   exp: number;
// }

// export function middleware(request: NextRequest) {
//   const token =
//     request.cookies.get("accessToken")?.value ||
//     request.cookies.get("next-auth.session-token")?.value ||
//     request.cookies.get("__Secure-next-auth.session-token")?.value;

//   const { pathname } = request.nextUrl;

//   // Helper function to verify token
//   const verifyToken = (token: string) => {
//     try {
//       return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as Decoded;
//     } catch {
//       return null;
//     }
//   };

//   const decoded = token ? verifyToken(token) : null;
// console.log("decoded", decoded);

//   // Protect dashboard routes
//   if (pathname.startsWith("/dashboard")) {
//     if (!decoded) {
//       const response = NextResponse.redirect(new URL("/login", request.url));
//       return response;
//     }
//     return NextResponse.next();
//   }

//   // Redirect authenticated users away from login/register
//   if (pathname === "/login" || pathname === "/register") {
//     if (decoded) {
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/login", "/register"],
// };
