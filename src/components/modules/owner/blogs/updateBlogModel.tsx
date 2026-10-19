"use client";

import { useEffect, useRef } from "react";
import { FileMetadata } from "@/hooks/use-file-uploader";
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
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TiptapEditor } from "@/components/ui/tiptap-editor";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BlogFormSchema } from "@/zodSchema/blogs.schema";
import { toast } from "sonner";
import { IUser } from "@/interfaces/user.interfaces";
import { Edit2, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IBlog, BlogFormValues } from "@/interfaces/blogs.interfaces";
import { BASE_URL } from "@/lib/apiConfig";
import { Editor } from "@tiptap/react";
import { isActive, Role } from "@/interfaces/user.interfaces";
import MultipleImageUploader from "@/components/MultipleImageUploader";

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
  const editorRef = useRef<Editor>(null);

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

  // Sync form state when blog prop changes
  useEffect(() => {
    form.reset({
      title: blog.title,
      content: blog.content,
      published: blog.published,
      publishedDate: new Date(blog.publishedDate).toISOString().slice(0, 16),
      tags: blog.tags.join(", "),
      images: [],
    });
  }, [blog, form]);

  const onsubmit = async (data: BlogFormValues) => {
    // Auto-generate slug from title if not provided
    const slug = data.title.split(" ").join("-").toLowerCase();
    const processedTags = data.tags ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [];
    const finalBlogData = {
      ...data,
      slug,
      tags: processedTags,
      images: images.filter(isFile).map((file) => file.name),
    };

    // Use token to get user ID - removed unnecessary getme API call
    const user: IUser = {
      id: parseInt(token),
      name: blog.author?.name || "Owner",
      email: "owner@example.com",
      password: "",
      avater: blog.author?.avater || "https://cdn-icons-png.flaticon.com/512/9385/9385289.png",
      skills: [],
      address: "",
      phone: "",
      isActive: isActive.ACTIVE,
      role: Role.OWNER,
      isVerified: true,
      github: "",
      linkedin: "",
      twitter: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const finalBlogDataWithAuthor = {
      ...finalBlogData,
      authorId: user.id,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/blogs/${blog.slug}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token as string,
          },
          body: JSON.stringify(finalBlogDataWithAuthor),
          credentials: "include",
          next: { tags: ["blogs"] },
        }
      );

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
                    <div className="relative">
                      <TiptapEditor
                        value={field.value}
                        onChange={field.onChange}
                        ref={editorRef}
                      />
                      <div className="absolute top-2 right-2 z-10">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="image-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && editorRef.current) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                const base64 = reader.result as string;
                                editorRef.current?.chain().focus().setImage({ src: base64 }).run();
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer p-2 rounded-md hover:bg-muted transition-colors"
                          title="Upload Image"
                        >
                          <Upload className="h-4 w-4" />
                        </label>
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
      </DialogContent>
    </Dialog>
  );
}