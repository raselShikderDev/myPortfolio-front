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
import { IWorkExperince } from "@/interfaces/workExperience";
import { Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface WorkExperienceFormValues {
  companyName: string;
  role: string;
  descreption: string;
  startDate: string;
  endDate: string;
}

interface AuthResponse {
  user: {
    id: number;
    email: string;
    role: "OWNER";
    iat: number;
    exp: number;
  };
  token: string;
}

export function UpdateWorkExperienceModal({
  workExp,
}: {
  workExp: IWorkExperince;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [tokens, setTokens] = useState<null | AuthResponse>(null);
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setTokens(data))
      .catch(console.error);
  }, []);

  console.log(tokens);

  const form = useForm<WorkExperienceFormValues>({
    defaultValues: {
      companyName: workExp.companyName,
      role: workExp.role,
      descreption: workExp.descreption,
      startDate: "",
      endDate: "",
    },
  });

  const onsubmit = async (data: WorkExperienceFormValues) => {
    const finalWorkExpData = {
      ...data,
      userId: 1,
    };

    // console.log(token);
    const jsonData = JSON.stringify(finalWorkExpData);
    console.log(jsonData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/work-experience/edit/${workExp.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: tokens?.token as string,
          },
          body: jsonData,
          credentials: "include",
          next: {
            tags: ["workExp"],
          },
        }
      );
      console.log(response);

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        toast.error(responseData.message || "Updating work experience failed");
        return;
      }

      toast.success("Work experience Updated successfully");
      form.reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update work experience");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="cursor-pointer">
          <Edit2 />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Work Experience</DialogTitle>
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
            <Button className="cursor-pointer" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="cursor-pointer"
            type="submit"
            form="add-work-exp"
            disabled={form.formState.isSubmitting || !tokens?.token}
          >
            Save Experience
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
