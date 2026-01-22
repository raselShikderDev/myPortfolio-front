'use server';
import { cookies } from 'next/headers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const login = async (data: any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

 
  const result = await res.json();
  console.log({result});
  
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
