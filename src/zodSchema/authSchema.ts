import z from "zod";

export const LoginFormSchema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string({ message: "Password required" })
    .min(6, "Password must be at least 6 character")
    .max(16, "password should contain maximum 16 character"),
});

