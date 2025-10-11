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
    defaultValues: {
      companyName: "",
      role: "",
      descreption: "",
      startDate: "",
      endDate: "",
    },
  });

  const onsubmit = async (data: WorkExperienceFormValues) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/getme`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
        next: {
          revalidate: 60,
        },
      }
    );

    const responseData = await response.json();
    const user: IUser = responseData.data;

    const finalWorkExpData = {
      ...data,
      userId: user.id,
    };

    const jsonData = JSON.stringify(finalWorkExpData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/work-experience/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: jsonData,
          credentials: "include",
          next: {
            tags: ["workExp"],
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        toast.error(responseData.message || "Adding work experience failed");
        return;
      }

      toast.success("Work experience added successfully");

      form.reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add work experience");
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
            <Button className="cursor-pointer" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="cursor-pointer"
            type="submit"
            form="add-work-exp"
            disabled={form.formState.isSubmitting}
          >
            Save Experience
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
