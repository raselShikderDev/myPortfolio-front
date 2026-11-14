"use client";

import { useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { TiptapEditor } from "@/components/ui/tiptap-editor";
import { FileMetadata } from "@/hooks/use-file-uploader";
import { BlogFormSchema } from "@/zodSchema/blogs.schema";
import { toast } from "sonner";
import { IUser } from "@/interfaces/user.interfaces";
import { IBlog, BlogFormValues } from "@/interfaces/blogs.interfaces";
import { BASE_URL } from "@/lib/apiConfig";
import { Loader2 } from "lucide-react";
import { generateSlug } from "@/lib/utils/generateSlug";
import { Button } from "@/components/ui/button";
import MultipleImageUploader from "@/components/MultipleImageUploader";
import { uploadToImageBB } from "@/utils/imageUploader";

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
  const editorRef = useRef<Editor | null>(null);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(BlogFormSchema),
    mode: "onChange",
    defaultValues: {
      title: blog.title,
      content: blog.content || "",
      images: [],
      published: blog.published,
      publishedDate: new Date(blog.publishedDate).toISOString().slice(0, 16),
      tags: blog.tags.join(", "),
    },
  });

  // Reset form to the current blog's data whenever the dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        title: blog.title,
        content: blog.content || "",
        images: [],
        published: blog.published,
        publishedDate: new Date(blog.publishedDate).toISOString().slice(0, 16),
        tags: blog.tags.join(", "),
      });
      setImages([]);
    }
  }, [open, blog, form]);

  const onsubmit = async (data: BlogFormValues) => {
    console.log("Form Data:", data);
    // Auto-generate slug from title
    const slug = generateSlug(data.title);
    const tags = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [];
    const newData = { ...data, slug, tags };
    form.clearErrors();
    let uploadedImageUrls: string[] = [];

    // Filter for actual File objects from the 'images' state
    const filesToUpload = images.filter(isFile);

    if (filesToUpload.length > 0) {
      try {
        const uploadPromises = filesToUpload.map((file) => uploadToImageBB(file));
        uploadedImageUrls = await Promise.all(uploadPromises);
      } catch (error: unknown) {
        console.error("ImageBB Upload Error:", error);
        toast.error("Failed to upload some images");
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

    // Preserve existing blog images that were not removed, plus newly uploaded ones
    const preservedExistingImages = images
      .filter((img): img is FileMetadata => !(img instanceof File))
      .map((img) => img.url);
    const finalImages = [...preservedExistingImages, ...uploadedImageUrls];

    const finalBlogData = {
      ...newData,
      authorId: user.id,
      images: finalImages,
    };
    const jsonData = JSON.stringify(finalBlogData);
    console.log("URL:", `${BASE_URL}/blogs/update/${blog.slug}`)

    try {
      const response = await fetch(`${BASE_URL}/blogs/update/${blog.slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token as string,
        },
        body: jsonData,
        credentials: "include",
        next: { tags: ["blogs"] },
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        toast.error(responseData.message || "Blog update failed");
        return;
      }

      toast.success("Blog updated successfully!");
      setOpen(false);
      form.reset();
      setImages([]);
    } catch (err) {
      console.error(err);
      toast.error("Updating blog failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="cursor-pointer">
          Edit Blog
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Update Blog</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1">
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
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <Input
                        placeholder="Blog Title"
                        {...field}
                        className="grow"
                        onPaste={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1 min-h-0">
                    <FormControl>
                      <div className="flex-1 min-h-[200px] rounded-md border border-input bg-background">
                        <div className="relative">
                          <TiptapEditor
                            value={field.value}
                            onChange={field.onChange}
                            ref={editorRef}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <Input
                        placeholder="Tags (comma separated)"
                        {...field}
                        value={field.value || ""}
                        className="grow"
                        onPaste={(e) => {
                          e.stopPropagation();
                        }}
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

              <MultipleImageUploader
                initialFiles={blog.images.map((url) => ({
                  name: url.split("/").pop() || "image",
                  size: 0,
                  type: "image/*",
                  url,
                  id: url,
                }))}
                onChange={setImages}
              />
            </form>
          </Form>
        </div>

        <div className="pt-4 mt-auto border-t border-border">
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={form.formState.isSubmitting} variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form="add-blog-form"
              disabled={form.formState.isSubmitting}
              className="cursor-pointer"
            >
              {!form.formState.isSubmitting && `Save Changes`}
              {form.formState.isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}