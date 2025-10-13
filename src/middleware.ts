import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl.clone();

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

// import { NextResponse, NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get("accessToken")?.value;
//   const url = request.nextUrl.clone();
//   const { pathname } = request.nextUrl;

//   if (pathname === "/login" && token) {
//     try {
//       const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
//       await jwtVerify(token, secret);
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     } catch {}
//   }

//   if (!token) {
//     if (pathname.startsWith("/dashboard")) {
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }
//     return NextResponse.next();
//   }

//   try {
//     const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
//     await jwtVerify(token, secret);
//     return NextResponse.next();
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     console.log("JWT verification error:", error);

//     if (error.name === "JWTExpired") {
//       console.log("Token expired, fetching new token...");

//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/auth/generate-token`,
//           {
//             method: "POST",
//           }
//         );
//         const data = await res.json();

//         if (res.ok && data?.success && data?.data?.accessToken) {
//           const response = NextResponse.next();
//           response.cookies.set("accessToken", data.data.accessToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none",
//             path: "/",
//           });
//           response.cookies.set("refreshToken", data.data.refreshToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none",
//             path: "/",
//           });
//           return response;
//         }
//       } catch (e) {
//         console.error("Failed to refresh token:", e);
//       }
//     }
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/login"],
// };

// import { jwtVerify } from "jose";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   const token =
//     request.cookies.get("accessToken")?.value ||
//     request.cookies.get("next-auth.session-token")?.value ||
//     request.cookies.get("__Secure-next-auth.session-token")?.value;

//   const { pathname } = request.nextUrl;

//   if (pathname.startsWith("/dashboard") && !token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   if (token) {
//     try {
//       const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
//       const { payload } = await jwtVerify(token, secret);
//       console.log("decoded in middleware:", payload);
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       if (error.code === "ERR_JWT_EXPIRED") {
//         console.log("Token expired, fetching new token from API...");

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/auth/generate-token`,
//           {
//             method: "POST",
//           }
//         );
//         const data = await res.json();
//         console.log("New token data:", data);
//         if (res.ok) {
//           return NextResponse.next();
//         } else {
//           return NextResponse.redirect(new URL("/login", request.url));
//         }
//       } else {
//         console.log("JWT verification error:", error);
//         return NextResponse.redirect(new URL("/login", request.url));
//       }
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/login", "/register"],
// };

// /* eslint-disable @typescript-eslint/no-unused-vars */
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// interface decoded {
//   id: number;
//   email: string;
//   role: "OWNER";
// }

// export async function middleware(request: NextRequest) {
//   const token =
//     request.cookies.get("accessToken")?.value ||
//     request.cookies.get("next-auth.session-token")?.value ||
//     request.cookies.get("__Secure-next-auth.session-token")?.value;
//   const { pathname } = request.nextUrl;

//   if (pathname.startsWith("/dashboard")) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }
//   try {
//     if (token) {
//       try {
//         const decoded = jwt.verify(
//           token,
//           process.env.JWT_ACCESS_SECRET as string
//         );
//         console.log("decoded in middleware: ", decoded);
//       } catch (error) {
//         console.log("JWT error in middleware:", error);
//       }
//     } else {
//       console.log("No token found in middleware");
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   } catch (error) {
//     if (error instanceof jwt.TokenExpiredError) {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/generate-token`,
//         {
//           method: "POST",
//         }
//       );
//       const data = await res.json();
//       console.log("In middleware after generating token:", data);

//       if (res.ok) {
//         return NextResponse.next();
//       } else {
//         return NextResponse.redirect(new URL("/login", request.url));
//       }
//     }
//   }
//   // if ((pathname === "/login" || pathname === "/register") && token) {
//   //   return NextResponse.redirect(new URL("/dashboard", request.url));
//   // }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/login", "/register"],
// };

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
