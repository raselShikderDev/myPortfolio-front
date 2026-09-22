'use server';
import { cookies } from 'next/headers';

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res?.ok) {
    await res.text();
  }
  const result = await res.json();
  if (result?.success) {
    const cookiesStore = await cookies();
    cookiesStore.set('token', result?.data?.accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
    });
  }

  return result;

  };
