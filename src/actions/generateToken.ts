"use server";

import { cookies } from "next/headers";
import { getBaseUrl } from "@/lib/apiConfig";

export const generateToken = async () => {
  try {
    const res = await fetch(
      `${getBaseUrl()}/auth/generate-token`,
      {
        method: "POST",
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || 'Failed to generate token');
    }

    const result = await res.json();
    if (!result?.success) {
      throw new Error('Authentication failed. Please log in again.');
    }

    const cookiesStore = await cookies();
    cookiesStore.set(
      "accessToken",
      result.data.accessToken,
      {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === 'production',
        path: "/",
      }
    );
    cookiesStore.set(
      "refreshToken",
      result.data.refreshToken,
      {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === 'production',
        path: "/",
      }
    );

    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('network')) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred while generating token.');
  }
};
