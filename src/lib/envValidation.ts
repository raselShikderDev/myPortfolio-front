import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  NEXT_PUBLIC_IMAGEBB_API_KEY: z.string().min(1, "ImageBB API key is required"),
  NEXT_PUBLIC_IMAGEBB_API_LINK: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(1, "JWT access secret is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT refresh secret is required"),
});

export function validateEnvs() {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingFields = Object.keys(error.flatten().fieldErrors);
      throw new Error(`Missing required environment variables: ${missingFields.join(", ")}`);
    }
    throw error;
  }
}

// Validate environment variables on import
validateEnvs();
