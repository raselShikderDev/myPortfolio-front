import {
  afterEach,
  describe,
  expect,
  mock,
  spyOn,
  test,
} from "bun:test";

mock.module("@/lib/apiConfig", () => ({
  getBaseUrl: () => "http://test.local",
  BASE_URL: "http://test.local",

  getFrontendBaseUrl: () => "http://test.local",
  FRONTEND_BASE_URL: "http://test.local",

  getImageBBApiKey: () => "test-key",
  IMAGEBB_API_KEY: "test-key",

  getImageBBApiLink: () => "http://test.local/image",
  IMAGEBB_API_LINK: "http://test.local/image",

  API_PATHS: {
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
  },

  buildApiUrl: (path: string) => `http://test.local${path}`,
}));

const { apiRequest, ApiError } = await import("@/lib/apiHelper");

describe("apiRequest", () => {
  let fetchSpy: ReturnType<typeof spyOn>;

  afterEach(() => {
    fetchSpy?.mockRestore();
  });

  test("should handle successful JSON response", async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: "test" }),
      headers: new Headers({
        "content-type": "application/json",
      }),
    };

    fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(
      mockResponse as Response
    );

    const result = await apiRequest("/test");

    expect(result).toEqual({ data: "test" });
  });

  test("should handle non-2xx response", async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: "Not found" }),
      headers: new Headers({
        "content-type": "application/json",
      }),
    };

    fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(
      mockResponse as Response
    );

    await expect(apiRequest("/test")).rejects.toThrow(ApiError);
  });

  test("should handle non-JSON response", async () => {
    const mockResponse = {
      ok: true,
      text: () => Promise.resolve("plain text"),
      headers: new Headers({
        "content-type": "text/plain",
      }),
    };

    fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(
      mockResponse as Response
    );

    const result = await apiRequest("/test");

    expect(result).toBe("plain text");
  });
});