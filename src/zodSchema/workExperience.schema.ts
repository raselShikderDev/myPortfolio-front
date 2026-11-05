import z from "zod";

// Form-level validation schema for the Add/Update Work Experience modals.
// Mirrors the WorkExperienceFormValues shape used by React Hook Form.
// Note: the form field is named `descreption` (existing typo) to preserve
// existing field names and API contracts; do not rename here.
export const WorkExperienceFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  descreption: z.string().min(1, "Job description is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

export type WorkExperienceFormValues = z.infer<typeof WorkExperienceFormSchema>;
