import type { Metadata } from "next";
import { Outfit as OutfitFont, Ovo as OvoFont } from "next/font/google";
import "@/app/globals.css";
import ThemeProviderWrapper from "@/provider/themeProviderWrapper";
import { Toaster } from "sonner";

const Outfit = OutfitFont({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-outfit" });
const Ovo = OvoFont({ subsets: ["latin"], weight: ["400"], variable: "--font-ovo" });

export const metadata: Metadata = {
  title: "Rasel Shikder — MERN Stack Developer",
  description: "Rasel Shikder is a MERN stack developer building thoughtful, scalable web experiences from Dhaka.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className={`${Outfit.variable} ${Ovo.variable} overflow-x-hidden`}>
        <ThemeProviderWrapper><main>{children}</main><Toaster /></ThemeProviderWrapper>
      </body>
    </html>
  );
}
