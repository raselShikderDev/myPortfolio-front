import { BlogFormSchema } from "@/zodSchema/blogs.schema";
import { describe, expect, test } from "bun:test";

describe("BlogFormSchema", () => {
  test("should validate valid blog data", () => {
    const validData = {
      title: "Test Blog",
      content: "<p>Test content</p>",
      images: ["image1.jpg"],
      published: true,
      publishedDate: "2023-01-01",
      slug: "test-blog",
      tags: "test",
      authorId: 1,
    };
    expect(BlogFormSchema.safeParse(validData).success).toBe(true);
  });

  test("should reject empty title", () => {
    const invalidData = {
      title: "",
      content: "<p>Test content</p>",
      images: ["image1.jpg"],
      published: true,
      publishedDate: "2023-01-01",
      slug: "test-blog",
      tags: "test",
      authorId: 1,
    };
    expect(BlogFormSchema.safeParse(invalidData).success).toBe(false);
  });

  test("should reject invalid slug", () => {
    const invalidData = {
      title: "Test Blog",
      content: "<p>Test content</p>",
      images: ["image1.jpg"],
      published: true,
      publishedDate: "2023-01-01",
      slug: "Invalid Slug",
      tags: "test",
      authorId: 1,
    };
    expect(BlogFormSchema.safeParse(invalidData).success).toBe(false);
  });
});