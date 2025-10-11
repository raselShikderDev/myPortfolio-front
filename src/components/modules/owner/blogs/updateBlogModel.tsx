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
import { Edit2 } from "lucide-react";
import { IBlog } from "@/interfaces/blogs.interfaces";

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

export function UpdateBlogModal({
  token,
  blog,
}: {
  token: string;
  blog: IBlog;
}) {
  const [images, setImages] = useState<(File | FileMetadata)[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<BlogFormValues>({
    mode:"onChange",
    defaultValues: {
      title: blog.title,
      content: blog.content,
      images: [],
      published: blog.published,
      publishedDate: new Date().toISOString().slice(0, 16),
      slug: blog.slug,
      tags: blog.tags.join(", "),
    },
  });

  const onsubmit = async (data: any) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/getme`,
      {
        method: "GET",
        headers: {
          Authorization: token,
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
      .map((tag:any) => tag.trim())
      .filter(Boolean);

    const finalBlogData = {
      ...data,
      tags: processedTags,
      images: images.filter(isFile).map((file) => file.name),
    };

    console.log(" Blog Form Data:", finalBlogData);

    const formData = new FormData();
    formData.append("data", JSON.stringify(finalBlogData));

    // Append only actual File objects
    images.filter(isFile).forEach((file) => formData.append("files", file));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/create`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
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
          <Edit2 className="w-4 h-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Blog</DialogTitle>
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
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            form="add-blog-form"
            disabled={form.formState.isSubmitting}
          >
            Save Blog
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
