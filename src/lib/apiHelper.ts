import { getBaseUrl } from './apiConfig';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
    credentials: options.credentials || 'same-origin',
    cache: options.cache,
    next: options.next,
  };

  if (options.body) {
    if (
      !(options.body instanceof FormData) &&
      !(options.body instanceof Blob) &&
      !(options.body instanceof URLSearchParams)
    ) {
      config.body = JSON.stringify(options.body);
    } else {
      config.body = options.body;
    }
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }
      throw new ApiError(
        (errorData as { message?: string }).message || `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      return text as unknown as T;
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new Error(`Network error: ${error.message}`);
    }
    throw new Error('An unknown network error occurred');
  }
}