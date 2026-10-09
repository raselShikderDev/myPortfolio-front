import { afterEach, describe, expect, test } from "bun:test";
import { getBaseUrl } from "@/lib/apiConfig";

const originalInternalUrl = process.env.INTERNAL_API_BASE_URL;
const originalPublicUrl = process.env.NEXT_PUBLIC_BASE_URL;

afterEach(() => {
  if (originalInternalUrl !== undefined) {
    process.env.INTERNAL_API_BASE_URL = originalInternalUrl;
  } else {
    delete process.env.INTERNAL_API_BASE_URL;
  }
  if (originalPublicUrl !== undefined) {
    process.env.NEXT_PUBLIC_BASE_URL = originalPublicUrl;
  } else {
    delete process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (typeof (globalThis as Record<string, unknown>).window !== "undefined") {
    delete (globalThis as Record<string, unknown>).window;
  }
});

describe("getBaseUrl - Server vs Client selection", () => {
  test("should use INTERNAL_API_BASE_URL on server when available", () => {
    delete (globalThis as Record<string, unknown>).window; // Server environment
    process.env.INTERNAL_API_BASE_URL = "http://host.docker.internal:5000/api/v1";
    process.env.NEXT_PUBLIC_BASE_URL = "https://rasel-shikder-backend.vercel.app/api/v1";

    const result = getBaseUrl();
    expect(result).toBe("http://host.docker.internal:5000/api/v1");
  });

  test("should fall back to NEXT_PUBLIC_BASE_URL on server when INTERNAL_API_BASE_URL is not set", () => {
    delete (globalThis as Record<string, unknown>).window; // Server environment
    delete process.env.INTERNAL_API_BASE_URL;
    process.env.NEXT_PUBLIC_BASE_URL = "https://rasel-shikder-backend.vercel.app/api/v1";

    const result = getBaseUrl();
    expect(result).toBe("https://rasel-shikder-backend.vercel.app/api/v1");
  });

  test("should use NEXT_PUBLIC_BASE_URL on client even when INTERNAL_API_BASE_URL is set", () => {
    (globalThis as Record<string, unknown>).window = {}; // Client environment
    process.env.INTERNAL_API_BASE_URL = "http://host.docker.internal:5000/api/v1";
    process.env.NEXT_PUBLIC_BASE_URL = "https://rasel-shikder-backend.vercel.app/api/v1";

    const result = getBaseUrl();
    expect(result).toBe("https://rasel-shikder-backend.vercel.app/api/v1");
  });
});
