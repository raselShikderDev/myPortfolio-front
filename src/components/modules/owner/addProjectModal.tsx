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
// import { ProjectCreateSchema } from "@/zodSchema/projects.schema";
// import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
// import z from "zod";

export function AddProjectModal({ token }: { token: string }) {
  const [image, setImage] = useState<File | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      techStack: "",
      liveUrl: "",
      githubUrl: "",
    },
  });

  const onsubmit = async (data: any) => {
    const processedTechStack = data.techStack
      .split(",")
      .map((tech: any) => tech.trim())
      .filter(Boolean);

    const finalProjectData = {
      ...data,
      techStack: processedTechStack,
      image: image ? image.name : null,
    };

    console.log("Project Form Data:", data);
    console.log("Image File:", image);
    console.log("FINAL PROCESSED PROJECT DATA:", finalProjectData);

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({ ...data, techStack: processedTechStack })
    );
    if (image) formData.append("file", image);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/projects/create`,
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formData, 
          credentials: "include",
          next: {
            tags: ["projects"],
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        toast.error(responseData.message || "Project adding failed");
        return;
      }

      // const toastId = toast.loading("Adding project...");
      toast.success("Project added");

      console.log("Login successful, response:", responseData);
    } catch (err) {
      console.error(err);
      toast.error("Adding project is failed");
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
            {/* --- Project Title Field (was 'name') --- */}
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

            {/* --- Project Description Field (unchanged name) --- */}
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

            {/* --- New Field: Tech Stack --- */}
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

            {/* --- New Field: Live URL --- */}
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
            form="add-project" // Changed from 'add-division'
            disabled={form.formState.isSubmitting}
          >
            Save Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
