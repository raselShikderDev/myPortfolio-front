/**
 * Centralized API Configuration
 *
 * This file provides a single source of truth for all public API configurations.
 * All environment variables used in both server and client code must be prefixed
 * with NEXT_PUBLIC_ in their definition.
 */

/**
 * Backend API Base URL
 * Must be defined in .env as NEXT_PUBLIC_BASE_URL
 *
 * Examples:
 * - Development: http://localhost:5000/api/v1
 * - Production: https://rasel-shikder-backend.vercel.app/api/v1
 */
export const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_BASE_URL as string;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_BASE_URL is not defined in environment variables. " +
      "Please add it to your .env.local file."
    );
  }

  return url;
};

export const BASE_URL = getBaseUrl();

/**
 * Frontend Base URL
 * The public URL of the frontend application itself.
 * Must be defined in .env as NEXT_PUBLIC_FRONTEND_BASE_URL
 *
 * Examples:
 * - Development: http://localhost:3000
 * - Production: https://raselsdev.vercel.app
 */
export const getFrontendBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL as string;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_FRONTEND_BASE_URL is not defined in environment variables. " +
      "Please add it to your .env.local file."
    );
  }

  return url;
};

export const FRONTEND_BASE_URL = getFrontendBaseUrl();

/**
 * ImageBB API Key
 * Used for client-side image uploads through ImageBB service.
 * Must be defined in .env as NEXT_PUBLIC_IMAGEBB_API_KEY
 */
export const getImageBBApiKey = (): string => {
  const key = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY as string;

  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_IMAGEBB_API_KEY is not defined in environment variables. " +
      "Please add it to your .env.local file."
    );
  }

  return key;
};

export const IMAGEBB_API_KEY = getImageBBApiKey();

/**
 * ImageBB API Link
 * ImageBB service endpoint URL.
 * Must be defined in .env as NEXT_PUBLIC_IMAGEBB_API_LINK
 */
export const getImageBBApiLink = (): string => {
  const link = process.env.NEXT_PUBLIC_IMAGEBB_API_LINK as string;

  if (!link) {
    throw new Error(
      "NEXT_PUBLIC_IMAGEBB_API_LINK is not defined in environment variables. " +
      "Please add it to your .env.local file."
    );
  }

  return link;
};

export const IMAGEBB_API_LINK = getImageBBApiLink();

/**
 * Utilities for constructing API paths
 */
export const API_PATHS = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    generateToken: "/auth/generate-token",
  },

  blogs: {
    getAll: "/blogs/all",
    getOne: (slug: string) => `/blogs/${slug}`,
    create: "/blogs/create",
    update: (slug: string) => `/blogs/${slug}`,
    delete: (slug: string) => `/blogs/${slug}`,
    toggleStatus: (status: string, slug: string) =>
      `/blogs/${status}/${slug}`,
    stats: "/blogs/stats",
  },

  projects: {
    getAll: "/projects/all",
    getOne: (id: string) => `/projects/${id}`,
    create: "/projects/create",
    update: (id: string) => `/projects/edit/${id}`,
    delete: (id: string) => `/projects/${id}`,
  },

  workExperience: {
    getAll: "/work-experience/all",
    create: "/work-experience/create",
    update: (id: string) => `/work-experience/edit/${id}`,
    delete: (id: string) => `/work-experience/${id}`,
  },

  users: {
    getMe: "/users/getme",
  },

  contact: "/contact",
} as const;

/**
 * Helper function to build a full API URL from a path.
 */
export const buildApiUrl = (path: string): string => {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const baseUrl = getBaseUrl().replace(/\/$/, "");

  return `${baseUrl}/${cleanPath}`;
};