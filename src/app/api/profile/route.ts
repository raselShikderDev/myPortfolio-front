// app/api/profile/route.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
   const cookieStore = await cookies();
  const token =
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("next-auth.session-token")?.value ||
    cookieStore.get("__Secure-next-auth.session-token")?.value ||
    "";
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);


  return Response.json({ user: decoded, token });
}
