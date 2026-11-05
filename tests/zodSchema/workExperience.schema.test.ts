import { WorkExperienceFormSchema } from "@/zodSchema/workExperience.schema";
import { describe, expect, test } from "bun:test";

describe("WorkExperienceFormSchema", () => {
  test("should validate valid work experience data", () => {
    const validData = {
      companyName: "Test Company",
      role: "Test Role",
      descreption: "Test description",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
    };
    expect(WorkExperienceFormSchema.safeParse(validData).success).toBe(true);
  });

  test("should reject empty companyName", () => {
    const invalidData = {
      companyName: "",
      role: "Test Role",
      descreption: "Test description",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
    };
    expect(WorkExperienceFormSchema.safeParse(invalidData).success).toBe(false);
  });

  test("should reject empty role", () => {
    const invalidData = {
      companyName: "Test Company",
      role: "",
      descreption: "Test description",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
    };
    expect(WorkExperienceFormSchema.safeParse(invalidData).success).toBe(false);
  });

  test("should reject empty descreption", () => {
    const invalidData = {
      companyName: "Test Company",
      role: "Test Role",
      descreption: "",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
    };
    expect(WorkExperienceFormSchema.safeParse(invalidData).success).toBe(false);
  });

  test("should reject empty startDate", () => {
    const invalidData = {
      companyName: "Test Company",
      role: "Test Role",
      descreption: "Test description",
      startDate: "",
      endDate: "2023-12-31",
    };
    expect(WorkExperienceFormSchema.safeParse(invalidData).success).toBe(false);
  });

  test("should reject empty endDate", () => {
    const invalidData = {
      companyName: "Test Company",
      role: "Test Role",
      descreption: "Test description",
      startDate: "2023-01-01",
      endDate: "",
    };
    expect(WorkExperienceFormSchema.safeParse(invalidData).success).toBe(false);
  });
});