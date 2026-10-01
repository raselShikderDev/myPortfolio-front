import z from "zod";

// Form-level validation schema for the Add/Update Blog modals.
// Mirrors the BlogFormValues shape used by React Hook Form.
// Note: `images` is collected out-of-band via the image uploader, so it is
// optional here. `authorId` is derived server-side from the authenticated user.
export const BlogFormSchema = z.object({
  title: z.string().min(1, "Blog title is required"),
  content: z.string().min(1, "Blog content is required"),
  images: z.array(z.string()),
  published: z.boolean(),
  publishedDate: z.string().min(1, "Published date is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase, alphanumeric, and dash-separated"
    ),
  tags: z.string().min(1, "At least one tag is required"),
  authorId: z.number().optional(),
});

export type BlogFormValues = z.infer<typeof BlogFormSchema>;
