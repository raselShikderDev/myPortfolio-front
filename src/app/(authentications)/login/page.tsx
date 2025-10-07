"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordToggler from "@/components/passwordToggler";
import { toast } from "sonner";

// Zod schema for validation
const LoginFormSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

// Define your API response type
interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    console.log("Form submitted:", data);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      const responseData: LoginResponse = await response.json();

      if (!response.ok || !responseData.success) {
        toast.error(responseData.message || "Login failed");
        return;
      }

      const toastId = toast.loading("Logging in...");
      toast.success("Successfully logged in", { id: toastId });

      console.log("Login successful, response:", responseData);
    } catch (err) {
      console.error(err);
      toast.error("Your credentials are not valid");
    }
  };

  return (
    <section className="bg-muted min-h-screen dark:bg-[#11001f] flex items-center justify-center">
      <div className="min-w-sm w-full max-w-sm rounded-md border bg-background px-8 py-10 shadow-md dark:bg-gray-900">
        <h1 className="text-xl font-semibold mb-6">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1">
              Email
            </label>
            <Input id="email" placeholder="Your email" {...register("email")} />
            {formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1">
              Password
            </label>
            <PasswordToggler {...register("password")} />
            {formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!formState.isValid}
            className="w-full mt-4 cursor-pointer"
          >
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
}
