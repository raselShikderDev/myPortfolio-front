'use server';
import { cookies } from 'next/headers'
import { apiRequest } from '@/lib/apiHelper'
import { API_PATHS } from '@/lib/apiConfig'

interface LoginData {
  email: string;
  password: string;
}

export const signin = async (data: LoginData) => {
  try {
    const result = await apiRequest<{ success: boolean; data: { accessToken: string } }>(API_PATHS.auth.signin, {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
    if (result?.success) {
      const cookiesStore = await cookies();
      cookiesStore.set('accessToken', result.data.accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
    }
    return result;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
};

