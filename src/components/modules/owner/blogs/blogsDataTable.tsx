"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, EyeOff, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { IBlog } from "@/interfaces/blogs.interfaces";
import { useEffect, useState } from "react";
import { UpdateBlogModal } from "./updateBlogModel";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "../deleteWorkExpConfirmModal";

interface AuthResponse {
  user: { id: number; email: string; role: "OWNER"; iat: number; exp: number };
  token: string;
}

export default function BlogsTable({ blogs }: { blogs: IBlog[] }) {
  const [tokens, setTokens] = useState<null | AuthResponse>(null);
  const [publishingSlug, setPublishingSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setTokens(data))
      .catch(console.error);
  }, []);

  const togglePublish = async (slug: string, currentStatus: boolean) => {
    setPublishingSlug(slug);
    const status = currentStatus ? "unpublish" : "publish";

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${status}/${slug}`,
        {
          method: "PATCH",
          headers: { Authorization: tokens?.token as string },
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        toast.error(
          responseData.message ||
            `${currentStatus ? "Unpublishing" : "Publishing"} blog failed`
        );
        return;
      }

      toast.success(
        responseData.message ||
          `${currentStatus ? "Unpublished" : "Published"} blog`
      );
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${currentStatus ? "unpublish" : "publish"} blog`);
    } finally {
      setPublishingSlug(null);
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${slug}`,
        {
          method: "DELETE",
          headers: {
            Authorization: tokens?.token as string,
          },
          credentials: "include",
          next: { tags: ["BLOGS"] },
        }
      );

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        toast.error(responseData.message || "Deleting blog failed");
        return;
      }
      toast.success("Blog deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete Blog");
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-md border border-border">
      <div className="min-w-[700px]">
        <Table>
          <TableCaption className="text-sm text-muted-foreground">
            {!(blogs?.length > 0) && "No blogs found."}
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Title</TableHead>
              <TableHead className="hidden sm:table-cell text-center">
                Author
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Published Date
              </TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {blogs?.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell className="text-center">
                  <Link
                    href={`/blogs/${blog.slug}`}
                    target="_blank"
                    className="hover:underline hover:text-blue-500"
                  >
                    {blog.title}
                  </Link>
                </TableCell>

                <TableCell className="hidden sm:table-cell text-center">
                  {blog.author?.name || "Rasel Shikder"}
                </TableCell>

                <TableCell className="hidden md:table-cell text-center">
                  {blog.published
                    ? new Date(blog.publishedDate).toLocaleDateString()
                    : "-"}
                </TableCell>

                <TableCell className="text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      blog.published
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {blog.published ? "Published" : "Unpublished"}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
                    <UpdateBlogModal
                      blog={blog}
                      token={tokens?.token as string}
                    />

                    <Button
                      variant={blog.published ? "destructive" : "secondary"}
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => togglePublish(blog.slug, blog.published)}
                      disabled={publishingSlug === blog.slug}
                    >
                      {publishingSlug === blog.slug ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : blog.published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <DeleteConfirmationModal
                      onConfirm={() => handleDelete(blog.slug)}
                    >
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center justify-center gap-1 cursor-pointer w-full sm:w-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DeleteConfirmationModal>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
