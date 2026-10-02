"use server";

import { cookies } from "next/headers";
import { buildApiUrl } from "@/lib/apiConfig";



export const logout = async (token: string) => {
  const res = await fetch(buildApiUrl("/auth/logout"), {
    method: "POST",
    headers: {
      Authorization: token,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || 'Failed to logout. Please try again.');
  }

  const result = await res.json();
  if (result?.success) {
    const cookiesStore = await cookies();
    cookiesStore.delete("token");
    cookiesStore.delete("refreshToken");
  }

  return result;
};
