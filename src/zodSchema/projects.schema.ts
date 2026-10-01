import z from "zod";

export const ProjectCreateSchema = z.object({
  title: z
    .string()
    .min(3, 'Project title must be at least 3 characters long'),
  description: z
    .string()
    .min(10, 'Project description must be at least 10 characters long'),
  image: z
    .url('Project image must be a valid URL')
    .min(1, 'Project image URL is required')
    .optional(),
  techStack: z.string().min(1, 'Tech stack item cannot be empty')
    .min(1, 'At least one tech stack item is required'),
  liveUrl: z
    .url('Live URL must be a valid link')
    .min(1, 'Live project URL is required'),
  githubUrl: z
    .url('GitHub URL must be a valid link')
    .min(1, 'GitHub repository URL is required'),
  userId: z.number().positive('User ID must be a positive number'),
});

// Form-level validation schema for the Add/Update Project modals.
// Mirrors the ProjectFormValues shape used by React Hook Form.
// Differs from ProjectCreateSchema: `image` and `userId` are not form fields
// (image is uploaded separately, userId is fetched server-side), and the URL
// fields allow empty strings because the form defaults them to "".
export const ProjectFormSchema = z.object({
  title: z
    .string()
    .min(3, "Project title must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Project description must be at least 10 characters long"),
  techStack: z.string().min(1, "At least one tech stack item is required"),
  liveUrl: z
    .string()
    .refine(
      (value) => value === "" || /^https?:\/\/.+/.test(value),
      "Live URL must be a valid link"
    ),
  githubUrl: z
    .string()
    .refine(
      (value) => value === "" || /^https?:\/\/.+/.test(value),
      "GitHub URL must be a valid link"
    ),
});

export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;
