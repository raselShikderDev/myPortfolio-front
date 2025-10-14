/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MultipleImageUploader from "@/components/multipleFileUploader";
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
import { FileMetadata } from "@/hooks/use-file-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IUser } from "@/interfaces/user.interfaces";
import { uploadToImageBB } from "@/utils/imageUploader";
import { Loader2 } from "lucide-react";

interface BlogFormValues {
  title: string;
  content: string;
  images: string[];
  published: boolean;
  publishedDate: string;
  slug: string;
  tags: string;
}

// Type guard to narrow File | FileMetadata -> File
function isFile(file: File | FileMetadata): file is File {
  return file instanceof File;
}

export function AddBlogModal({ token }: { token: string }) {
  const [images, setImages] = useState<(File | FileMetadata)[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<BlogFormValues>({
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
      images: [],
      published: false,
      publishedDate: new Date().toISOString().slice(0, 16),
      slug: "",
      tags: "",
    },
  });

  const onsubmit = async (data: any) => {
    form.clearErrors();
    let uploadedImageUrls: string[] = [];

    // 1. Filter for actual File objects from the 'images' state
    const filesToUpload = images.filter(isFile);

    if (filesToUpload.length > 0) {
      console.log(`Uploading ${filesToUpload?.length} image(s)...`);

      try {
        // 2. Map the array of files to an array of upload promises
        const uploadPromises = filesToUpload.map((file) =>
          uploadToImageBB(file)
        );

        // Wait for ALL image uploads to complete concurrently
        uploadedImageUrls = await Promise.all(uploadPromises);

        console.log("All images uploaded successfully to ImageBB!");
      } catch (error: any) {
        console.error("ImageBB Upload Error:", error);
        console.log(
          error.message || "Failed to upload one or more images to ImageBB"
        );
        return;
      }
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/getme`,
      {
        method: "GET",
        headers: {
          Authorization: token as string,
        },
        next: {
          tags: ["projects"],
        },
      }
    );

    const responseData = await response.json();
    const user: IUser = responseData.data;
    console.log(user);

    data.authorId = user.id;
    const processedTags = data.tags
      .split(",")
      .map((tag: any) => tag.trim())
      .filter(Boolean);

    const finalBlogData = {
      ...data,
      tags: processedTags,
      images: uploadedImageUrls,
    };
    const jsonData = JSON.stringify(finalBlogData);
    console.log("FINAL PROCESSED PROJECT JSON DATA:", jsonData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token as string,
          },
          body: jsonData,
          credentials: "include",
          next: { tags: ["blogs"] },
        }
      );

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        toast.error(responseData.message || "Blog adding failed");
        return;
      }

      toast.success("Blog added successfully!");
      setOpen(false);
      form.reset();
      setImages([]);
    } catch (err) {
      console.error(err);
      toast.error("Adding blog failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="cursor-pointer">
          Add Blog
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Blog</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-5"
            id="add-blog-form"
            onSubmit={form.handleSubmit(onsubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Blog Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Blog Content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Tags (comma separated)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Slug (e.g., ai-changing-web)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </FormControl>
                  <label>Published</label>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publishedDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MultipleImageUploader onChange={setImages} />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={form.formState.isSubmitting} variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="add-blog-form"
            disabled={form.formState.isSubmitting}
            className="cursor-pointer"
          >
            {!form.formState.isSubmitting && `Add Blog`}
            {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
