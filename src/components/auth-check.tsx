import { getUserSession } from "@/lib/getUserSession";
import { verifyToken } from "@/lib/auth";

export async function checkAuthentication() {
  try {
    const token = await getUserSession();
    if (!token) {
      return false;
    }
    const isValid = await verifyToken(token);
    return !!isValid;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
}