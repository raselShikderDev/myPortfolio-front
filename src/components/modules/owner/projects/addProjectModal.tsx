/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/AddProjectModal.tsx (or wherever your component resides)
"use client";

import SingleFileImageUploader from "@/components/singelFileuploader";
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
import { uploadToImageBB } from "@/utils/imageUploader";
// import { ProjectCreateSchema } from "@/zodSchema/projects.schema";
// import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
// import z from "zod";

interface IDefaultValue {
  title: string;
  description: string;
  techStack: string;
  liveUrl: string;
  githubUrl: string;
}

export function AddProjectModal({ token }: { token: string }) {
  const [image, setImage] = useState<File | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<IDefaultValue>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      techStack: "",
      liveUrl: "",
      githubUrl: "",
    },
  });

  const onsubmit = async (data: any) => {
    form.clearErrors();
    let imageUrl: string | null = null;
    const toastId = "project-process";

    try {
      toast.loading("Adding Project...", { id: toastId });
      if (image) {
        try {
          imageUrl = await uploadToImageBB(image);
        } catch (error: any) {
          toast.error(error.message || "Failed to upload project image.", {
            id: toastId,
          });
          console.error("ImageBB Upload Error:", error);
          return;
        }
      }

      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/getme`,
        {
          method: "GET",
          headers: { Authorization: token as string },
          next: { tags: ["projects"] },
        }
      );

      const userData = await userResponse.json();

      if (!userResponse.ok || !userData.success) {
        toast.error(userData.message || "Failed to retrieve user data.", {
          id: toastId,
        });
        return;
      }
      const user: IUser = userData.data;
      const processedTechStack = data.techStack
        .split(",")
        .map((tech: any) => tech.trim())
        .filter(Boolean);

      const finalProjectData = {
        ...data,
        userId: user.id,
        techStack: processedTechStack,
        image: imageUrl ? imageUrl : null,
      };

      const jsonData = JSON.stringify(finalProjectData);
      console.log("FINAL PROCESSED PROJECT JSON DATA:", jsonData);

      const apiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/projects/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token as string,
          },
          body: jsonData,
          credentials: "include",
          next: { tags: ["projects"] },
        }
      );

      const apiResponseData = await apiResponse.json();

      if (!apiResponse.ok || !apiResponseData.success) {
        toast.error(apiResponseData.message || "Project adding failed.", {
          id: toastId,
        });
        return;
      }

      toast.success("Project added successfully!", { id: toastId });

      form.reset();
      setImage(null);
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(
        "Adding project failed: A network or server error occurred.",
        { id: toastId }
      );
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="cursor-pointer">
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-5"
            id="add-project" // Changed from 'add-division'
            onSubmit={form.handleSubmit(onsubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Project Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Project Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Tech Stack (e.g., React, Node.js)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="liveUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Live Site URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- New Field: GitHub URL --- */}
            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="GitHub Repository URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
          <SingleFileImageUploader onChange={setImage} />
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
            form="add-project"
            disabled={form.formState.isSubmitting}
          >
            Add Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
