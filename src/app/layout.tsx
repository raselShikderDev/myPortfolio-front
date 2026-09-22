import type { Metadata } from "next";
import { Outfit as OutfitFont, Ovo as OvoFont } from "next/font/google";
import "@/app/globals.css";
import ThemeProviderWrapper from "@/provider/themeProviderWrapper";
import { Toaster } from "sonner";

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
  authors: [{ name: "Rasel Shikder" }],
  creator: "Rasel Shikder",
  openGraph: {
    title: "Rasel Shikder",
    description: "Mern Stack Developer",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Rasel Shikder",
    description: "Mern Stack Developer",
  },
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
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Toaster />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
