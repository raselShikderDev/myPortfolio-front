import type { Metadata } from "next";
import { Outfit as OutfitFont, Ovo as OvoFont } from "next/font/google";
import "@/app/globals.css";
// import Navbar from "@/components/modules/layout/navbar";
import Footer from "@/components/modules/layout/footer";
import ThemeProviderWrapper from "@/provider/themeProviderWrapper";
import { Navbar2 } from "@/components/modules/layout/nav";

const Outfit = OutfitFont({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
});

const Ovo = OvoFont({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-ovo",
});

export const metadata: Metadata = {
  title: "Rasel Shikder",
  description: "Mern Stack Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${Outfit.variable} ${Ovo.variable} antialiased leading-8 dark:bg-[#11001f] dark:text-white overflow-x-hidden`}
      >
        <ThemeProviderWrapper>
          <Navbar2 />
          {children}
          <Footer />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
