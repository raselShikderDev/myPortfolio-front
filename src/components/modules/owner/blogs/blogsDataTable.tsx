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
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { IBlog } from "@/interfaces/blogs.interfaces";
import { useEffect, useState } from "react";
import { UpdateBlogModal } from "./updateBlogModel";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "../deleteWorkExpConfirmModal";

interface AuthResponse {
  user: {
    id: number;
    email: string;
    role: "OWNER";
    iat: number;
    exp: number;
  };
  token: string;
}

export default function BlogsTable({ blogs }: { blogs: IBlog[] }) {
  const [tokens, setTokens] = useState<null | AuthResponse>(null);
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setTokens(data))
      .catch(console.error);
  }, []);

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
          next: {
            tags: ["BLOGS"],
          },
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

  const togglePublish = async (slug: string, currentStatus: boolean) => {
    console.log(`${currentStatus ? "Unpublishing" : "Publishing"} blog `);
    const status = currentStatus ? "publish" : "unpublish";
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${status}/${slug}`,
        {
          method: "PATCH",
          headers: {
            Authorization: tokens?.token as string,
          },
          credentials: "include",
          next: {
            tags: ["BLOGS"],
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        toast.error(
          responseData.message ||
            `${currentStatus ? "Unpublishing" : "Publishing"} blog`
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
    }
  };

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableCaption className="text-sm text-muted-foreground">
          {!(blogs?.length > 0) && "No blogs found."}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px] text-center">Title</TableHead>
            <TableHead className="min-w-[150px] hidden sm:table-cell text-center">
              Author
            </TableHead>
            <TableHead className="min-w-[150px] hidden md:table-cell text-center">
              Published Date
            </TableHead>
            <TableHead className="min-w-[100px] text-center">Status</TableHead>
            <TableHead className="min-w-[150px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs?.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/blogs/${blog.slug}`}
                  target="_blank"
                  className="hover:underline hover:text-blue-500"
                >
                  {blog.title}
                </Link>
              </TableCell>

              <TableCell className="hidden sm:table-cell truncate max-w-[200px]">
                {blog.author?.name || "Unknown"}
              </TableCell>

              <TableCell className="hidden md:table-cell text-center">
                {blog.published
                  ? new Date(blog.publishedDate).toLocaleDateString()
                  : "-"}
              </TableCell>

              <TableCell className="text-center">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    blog.published
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {blog.published ? "Published" : "Unpublished"}
                </span>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <UpdateBlogModal
                    blog={blog}
                    token={tokens?.token as string}
                  />
                  <Button
                    variant={blog.published ? "destructive" : "secondary"}
                    size="sm"
                    onClick={() => togglePublish(blog.slug, blog.published)}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    {blog.published ? "Unpublish" : "Publish"}
                  </Button>
                  <DeleteConfirmationModal
                    onConfirm={() => handleDelete(blog.slug)}
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1 cursor-pointer"
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
  );
}
