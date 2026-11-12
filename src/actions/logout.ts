"use server";

import { cookies } from "next/headers";
import { buildApiUrl } from "@/lib/apiConfig";
import { fetchWithAuth } from "@/lib/fetchWithAuth";



export const logout = async (accessToken: string) => {
  const res = await fetchWithAuth(buildApiUrl("/auth/logout"), {
    method: "POST",
    headers: {
      Authorization: accessToken,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Network error' }));
    return { success: false, message: errorData.message || 'Failed to logout. Please try again.' };
  }

  const result = await res.json();
  if (result?.success) {
    const cookiesStore = await cookies();
    cookiesStore.delete("accessToken");
    cookiesStore.delete("refreshToken");
  }

  return result;
};
