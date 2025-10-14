"use server";

import { cookies } from "next/headers";

export const generateToken = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/generate-token`,
    {
      method: "POST",
    }
  );

  if (!res?.ok) {
    // console.error('User login failed!', await res.text());
    await res.text();
  }
  const result = await res.json();
  if (result?.success) {
    const cookiesStore = await cookies();
    cookiesStore.set("accessToken", result?.data?.accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });
    cookiesStore.set("refreshToken", result?.data?.refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });
  }

  return result;
};
