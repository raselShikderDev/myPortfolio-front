import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login | Rasel Shikder",
  description: "Login page for Rasel Shikder portfolio",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="">
      {children}
    </div>
  );
}
