import { Navbar2 } from "./modules/layout/nav";
import { getUserSession } from "@/lib/getUserSession";
import { verifyToken } from "@/lib/auth";

export async function NavbarWrapper() {
  const token = await getUserSession();
  let isAuthenticated = false;

  if (token) {
    try {
      const isValid = await verifyToken(token);
      isAuthenticated = !!isValid;
    } catch (error) {
      console.error("Authentication check failed:", error);
      isAuthenticated = false;
    }
  }

  return <Navbar2 isAuthenticated={isAuthenticated} />;
}