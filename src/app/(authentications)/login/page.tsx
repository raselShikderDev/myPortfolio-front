"use client";

import { LoginForm } from "@/components/modules/authentications/login";


// export const metadata = {
//   title: "Login | Rasel Shikder",
//   description: "Login to access your account and manage projects.",
//   keywords: ["Login", "Rasel Shikder", "Portfolio", "MERN Stack Developer"],
// };

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}