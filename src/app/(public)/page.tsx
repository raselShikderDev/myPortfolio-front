import Header from "@/components/modules/home/header";
import Services from "@/components/modules/home/services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rasel Shikder | Full Stack Developer",
  description:
    "Explore the portfolio of Rasel Shikder, a full-stack developer specializing in MERN stack, TypeScript, Next.js, and modern web solutions.",
  openGraph: {
    title: "Rasel Shikder | Full Stack Developer",
    description:
      "Explore the portfolio of Rasel Shikder, a full-stack developer specializing in MERN stack, TypeScript, Next.js, and modern web solutions.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rasel Shikder | Full Stack Developer",
    description:
      "Explore the portfolio of Rasel Shikder, a full-stack developer specializing in MERN stack, TypeScript, Next.js, and modern web solutions.",
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <Services/>
    </>
  );
}
