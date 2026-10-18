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
import { TiptapEditor } from "@/components/ui/tiptap-editor";
import { ImageDotTiptap } from "@/components/ui/image-tiptap";
import { useRef } from "react";
import { Editor } from "@tiptap/react";
import { isActive, Role } from "@/interfaces/user.interfaces";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogFormSchema } from "@/zodSchema/blogs.schema";
import { toast } from "sonner";
import { IUser } from "@/interfaces/user.interfaces";
import { BlogFormValues } from "@/interfaces/blogs.interfaces";
import { uploadToImageBB } from "@/utils/imageUploader";
import { Loader2 } from "lucide-react";
import { BASE_URL } from "@/lib/apiConfig";

// Type guard to narrow File | FileMetadata -> File
function isFile(file: File | FileMetadata): file is File {
  return file instanceof File;
}

export function AddBlogModal({ token }: { token: string }) {
  const [images, setImages] = useState<(File | FileMetadata)[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const editorRef = useRef<Editor>(null);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(BlogFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
      images: [],
      published: false,
      publishedDate: new Date().toISOString().slice(0, 16),
    },
  });

  const onsubmit = async (data: BlogFormValues) => {
    console.log("Form Data:", data);
    // Auto-generate slug from title
    const slug = data.title.split(" ").join("-").toLowerCase();
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
        return;
      }
    }

    // Use token to get user ID - removed unnecessary getme API call
    const user: IUser = {
      id: parseInt(token),
      name: "Owner",
      email: "owner@example.com", // Default email
      password: "", // Default password
      avater: "https://cdn-icons-png.flaticon.com/512/9385/9385289.png", // Default avatar
      skills: [], // Default skills
      address: "", // Default address
      phone: "", // Default phone
      isActive: isActive.ACTIVE, // Default status
      role: Role.OWNER, // Default role
      isVerified: true, // Default verified
      github: "", // Default github
      linkedin: "", // Default linkedin
      twitter: "", // Default twitter
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const finalBlogData = {
      ...newData,
      authorId: user.id,
      images: uploadedImageUrls,
    };
    const jsonData = JSON.stringify(finalBlogData);

    try {
      const response = await fetch(`${BASE_URL}/blogs/create`, {
        method: "POST",
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
          Add New Blog
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
                    <div className="relative">
                      <TiptapEditor
                        value={field.value}
                        onChange={field.onChange}
                        ref={editorRef}
                      />
                      <div className="absolute top-2 right-2 z-10">
                        <ImageDotTiptap editor={editorRef.current} />
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