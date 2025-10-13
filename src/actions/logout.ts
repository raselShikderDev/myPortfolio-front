"use server";

import { cookies } from "next/headers";

export const logout = async (token: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: token as string,
    },
  });

  if (!res?.ok) {
    // console.error('User login failed!', await res.text());
    await res.text();
  }
  const result = await res.json();
  if (result?.success) {
    // console.log('User login successful!', result);
    const cookiesStore = await cookies();
    cookiesStore.delete("accessToken");
    cookiesStore.delete("refreshToken");
  }

  return result;
};
