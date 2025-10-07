import Footer from "@/components/modules/layout/footer";
import { Navbar2 } from "@/components/modules/layout/nav";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar2 />
      <main className="min-h-dvh">{children}</main>
      <Footer />
    </>
  );
}
