// src/lib/getUserSession.ts
import { cookies } from "next/headers";

export async function getUserSession() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("next-auth.session-token")?.value ||
    cookieStore.get("__Secure-next-auth.session-token")?.value ||
    "";
  return token;
}
