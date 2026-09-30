'use server';
import { cookies } from 'next/headers'
import { apiRequest } from '@/lib/apiHelper'
import { API_PATHS } from '@/lib/apiConfig'

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  try {
    const result = await apiRequest<{ success: boolean; data: { accessToken: string } }>(API_PATHS.auth.login, {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
    if (result?.success) {
      const cookiesStore = await cookies();
      cookiesStore.set('token', result.data.accessToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
      });
    }
    return result;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

