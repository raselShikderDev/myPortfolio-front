/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SingleFileImageUploaderWithPreview from "@/components/previewImage/singleImageUploaderWithPreview";
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
import { IProject } from "@/interfaces/projects.interfaces";
import { IUser } from "@/interfaces/user.interfaces";
import { Edit2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function UpdateProjectModal({
  token,
  project,
}: {
  token: string;
  project: IProject;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      title: project.title || "",
      description: project.description || "",
      techStack: project.techStack.join(", ") || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
    },
  });

  const onsubmit = async (data: any) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/getme`,
      {
        method: "GET",
        headers: { Authorization: token },
        next: { revalidate: 60 },
      }
    );

    const responseData = await response.json();
    const user: IUser = responseData.data;

    const processedTechStack = data.techStack
      .split(",")
      .map((tech: any) => tech.trim())
      .filter(Boolean);

    data.userId = user.id || 1;

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({ ...data, techStack: processedTechStack })
    );
    if (image) formData.append("file", image);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/projects/edit/${project.id}`,
        {
          method: "PATCH",
          headers: { Authorization: token },
          body: formData,
          credentials: "include",
          next: { tags: ["projects"] },
        }
      );

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        toast.error(responseData.message || "Project updating failed");
        return;
      }

      toast.success("Project Updated");
      form.reset();
      setOpen(false); 
    } catch (err) {
      console.error(err);
      toast.error("Updating project failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="cursor-pointer">
          <Edit2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Project</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-5"
            id="update-project"
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
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
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

          <SingleFileImageUploaderWithPreview
            previewExistingUrl={project.image}
            onChange={setImage}
          />
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="submit"
            form="update-project"
            className="cursor-pointer"
            disabled={form.formState.isSubmitting}
          >
            Save Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
