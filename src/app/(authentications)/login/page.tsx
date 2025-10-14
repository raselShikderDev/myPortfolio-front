"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordToggler from "@/components/passwordToggler";
import { LoginFormSchema } from "@/zodSchema/authSchema";
import { toast } from "sonner";
import { login } from "../../../actions/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
// import { cookies } from "next/headers";

type LoginFormValues = z.infer<typeof LoginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const toastId = "login-process";
      const response = await login(data);

      if (response.success) {
        router.push("/");
        toast.success("Successfully logged in", { id: toastId });
        return;
      }

      toast.error("Login failed", { id: toastId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "A network error occurred.", {
        id: "login-process",
      });
    }
  };

  return (
    <section className="bg-muted min-h-screen dark:bg-[#11001f] flex items-center justify-center">
      <div className="min-w-sm w-full max-w-sm rounded-md border bg-background px-8 py-10 shadow-md dark:bg-gray-900">
        <h1 className="text-xl font-semibold mb-6">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            disabled={!formState.isValid || formState.isSubmitting}
            className="w-full mt-4 cursor-pointer"
          >
            {!formState.isSubmitting && `Login`}
            {formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
