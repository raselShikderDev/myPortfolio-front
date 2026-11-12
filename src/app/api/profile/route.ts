import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";

    if (!accessToken) {
      return Response.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string);

    return Response.json({ user: decoded, accessToken });
  } catch (err) {
    console.error("JWT verification failed:", err);
    return Response.json({ success: false, message: 'Authentication required' }, { status: 401 });
  }
}
