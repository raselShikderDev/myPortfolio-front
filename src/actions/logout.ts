"use server";

import { cookies } from "next/headers";
import { getBaseUrl } from "@/lib/apiConfig";

export const logout = async (token: string) => {
  const res = await fetch(`${getBaseUrl()}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: token as string,
    },
  });

  if (!res?.ok) {
    console.error('User login failed!', await res.text());
    await res.text();
  }
  const result = await res.json();
  if (result?.success) {
    const cookiesStore = await cookies();
    cookiesStore.delete("token");
  }

  return result;
};
