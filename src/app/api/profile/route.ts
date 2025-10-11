import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("accessToken")?.value ||
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value ||
      "";

    if (!token) {
      return Response.json({ user: null, token: null }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

    return Response.json({ user: decoded, token });
  } catch (err) {
    console.error("JWT verification failed:", err);
    return Response.json({ user: null, token: null }, { status: 401 });
  }
}
