import { ProjectFormSchema } from "@/zodSchema/projects.schema";
import { describe, expect, test } from "bun:test";

describe("ProjectFormSchema", () => {
  test("should validate valid project data", () => {
    const validData = {
      title: "Test Project",
      description: "Test description",
      techStack: "React, TypeScript",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
    };
    expect(ProjectFormSchema.safeParse(validData).success).toBe(true);
  });

  test("should reject short title", () => {
    const invalidData = {
      title: "Te",
      description: "Test description",
      techStack: "React, TypeScript",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
    };
    expect(ProjectFormSchema.safeParse(invalidData).success).toBe(false);
  });

  test("should reject invalid URL", () => {
    const invalidData = {
      title: "Test Project",
      description: "Test description",
      techStack: "React, TypeScript",
      liveUrl: "invalid-url",
      githubUrl: "https://github.com/example",
    };
    expect(ProjectFormSchema.safeParse(invalidData).success).toBe(false);
  });
});