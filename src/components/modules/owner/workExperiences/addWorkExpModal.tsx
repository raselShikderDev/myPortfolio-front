"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IUser } from "@/interfaces/user.interfaces";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface WorkExperienceFormValues {
  companyName: string;
  role: string;
  descreption: string;
  startDate: string;
  endDate: string;
}

export function AddWorkExperienceModal({ token }: { token: string }) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<WorkExperienceFormValues>({
    mode: "onChange",
    defaultValues: {
      companyName: "",
      role: "",
      descreption: "",
      startDate: "",
      endDate: "",
    },
  });

  const onsubmit = async (data: WorkExperienceFormValues) => {
    const toastId = "work-exp-process";

    try {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/getme`,
        {
          method: "GET",
          headers: {
            Authorization: token as string,
          },
          next: {
            revalidate: 60,
          },
        }
      );

      const userData = await userResponse.json();

      // Check for user fetch failure
      if (!userResponse.ok || !userData.success) {
        toast.error(userData.message || "Failed to authenticate user data.", {
          id: toastId,
        });
        return;
      }
      const user: IUser = userData.data;

      const finalWorkExpData = {
        ...data,
        userId: user.id,
      };
      const jsonData = JSON.stringify(finalWorkExpData);

      const apiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/work-experience/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token as string,
          },
          body: jsonData,
          credentials: "include",
          next: {
            tags: ["workExp"],
          },
        }
      );
  
      const apiResponseData = await apiResponse.json();

      if (!apiResponse.ok || !apiResponseData.success) {
        toast.error(
          apiResponseData.message || "Adding work experience failed.",
          { id: toastId }
        );
        return;
      }

      toast.success("Work experience added successfully!", { id: toastId });

      form.reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to add work experience. A network or server error occurred.",
        { id: toastId }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="cursor-pointer">
          Add Work Experience
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Work Experience</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-5"
            id="add-work-exp"
            onSubmit={form.handleSubmit(onsubmit)}
          >
            {/* --- Company Name --- */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- Role --- */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Role (e.g., Senior Software Engineer)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- Description --- */}
            <FormField
              control={form.control}
              name="descreption"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Job Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- Start Date --- */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="date" placeholder="Start Date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- End Date --- */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="date" placeholder="End Date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={form.formState.isSubmitting} className="cursor-pointer" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="cursor-pointer"
            type="submit"
            form="add-work-exp"
            disabled={form.formState.isSubmitting}
          >
            {!form.formState.isSubmitting && `Create Experience`}
            {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
