import { cookies } from "next/headers";

export async function getUserSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";

  return accessToken;
}
