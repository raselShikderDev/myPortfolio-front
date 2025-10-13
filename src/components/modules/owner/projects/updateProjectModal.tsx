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
import { IProject } from "@/interfaces/projects.interfaces";
import { IUser } from "@/interfaces/user.interfaces";
import { uploadToImageBB } from "@/utils/imageUploader";
import { Edit2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface UpdateProjectFormValues {
  title: string;
  description: string;
  techStack: string;
  liveUrl: string;
  githubUrl: string;
}

export function UpdateProjectModal({
  token,
  project,
}: {
  token: string;
  project: IProject;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<UpdateProjectFormValues>({
    defaultValues: {
      title: project.title || "",
      description: project.description || "",
      techStack: project.techStack.join(", ") || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
    },
  });

  const onsubmit = async (data: UpdateProjectFormValues) => {
    let imageUrl: string | null = null;

    try {
      const toastId = "update-project-process";

      toast.loading("Updating Project...", { id: toastId });

      if (image) {
        try {
          imageUrl = await uploadToImageBB(image);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error);
          toast.error(error.message || "Failed to upload project image.", {
            id: toastId,
          });
          return;
        }
      }

      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/getme`,
        {
          method: "GET",
          headers: { Authorization: token as string },
          next: { revalidate: 60 },
        }
      );

      const userResponseData = await userResponse.json();

      if (!userResponse.ok || !userResponseData.success) {
        return;
      }
      const user: IUser = userResponseData.data;

      const processedTechStack = data.techStack
        .split(",")
        .map((tech: string) => tech.trim())
        .filter(Boolean);

      const finalProjectData = {
        ...data,
        userId: user.id || 1,
        techStack: processedTechStack,
        image: imageUrl !== null ? imageUrl : project.image,
      };

      const jsonData = JSON.stringify(finalProjectData);

      const apiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/projects/edit/${project.id}`,
        {
          method: "PATCH",
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
      if (apiResponse.ok) {
        toast.success("Project updated successfully!", {
          id: toastId,
          duration: 10,
        });
      }

      if (!apiResponse.ok || !apiResponseData.success) {
        return;
      }

      form.reset(data);
      setImage(null);
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Project updating failed", {
        id: "update-project-process",
      });
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

          <SingleFileImageUploader onChange={setImage} />
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
            update Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
