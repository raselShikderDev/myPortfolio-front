import Footer from "@/components/modules/layout/footer";
import { Navbar2 } from "@/components/modules/layout/nav";
import { getUserSession } from "@/lib/getUserSession";
import { verifyToken } from "@/lib/auth";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

  return (
    <>
      <Navbar2 isAuthenticated={isAuthenticated} />
      <main className="min-h-dvh">{children}</main>
      <Footer />
    </>
  );
}
