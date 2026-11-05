import { getCookie } from 'cookies-next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

interface FetchOptions extends RequestInit {
  retry?: boolean;
}

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: FetchOptions
): Promise<Response> {
  const accessToken = getCookie('accessToken');

  const headers = new Headers(init?.headers);
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${input}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  // Handle token refresh if needed
  if (response.status === 401 && !init?.retry) {
    const refreshResponse = await refreshToken();
    if (refreshResponse.ok) {
      // Retry the original request with the new token
      return fetchWithAuth(input, {
        ...init,
        retry: true,
      });
    }
  }

  return response;
}

async function refreshToken(): Promise<Response> {
  return fetch(`${API_BASE_URL}/auth/generate-token`, {
    method: 'POST',
    credentials: 'include',
  });
}