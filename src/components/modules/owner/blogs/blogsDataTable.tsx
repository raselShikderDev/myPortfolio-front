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

  const togglePublish = async (slug: string, currentStatus: boolean) => {
    const status = currentStatus ? "unpublish" : "publish";
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${status}/${slug}`,
        {
          method: "PATCH",
          headers: {
            Authorization: tokens?.token as string,
          },
          credentials: "include",
          next: { tags: ["BLOGS"] },
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
              <TableHead className="min-w-[150px] text-center">Title</TableHead>
              <TableHead className="min-w-[150px] hidden sm:table-cell text-center">
                Author
              </TableHead>
              <TableHead className="min-w-[150px] hidden md:table-cell text-center">
                Published Date
              </TableHead>
              <TableHead className="min-w-[120px] text-center">
                Status
              </TableHead>
              <TableHead className="min-w-[200px] text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs?.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell className="font-medium text-center">
                  <Link
                    href={`/blogs/${blog.slug}`}
                    target="_blank"
                    className="hover:underline hover:text-blue-500"
                  >
                    {blog.title}
                  </Link>
                </TableCell>

                <TableCell className="hidden sm:table-cell truncate max-w-[200px] text-center">
                  {blog.author?.name || "Unknown"}
                </TableCell>

                <TableCell className="hidden md:table-cell text-center">
                  {blog.published
                    ? new Date(blog.publishedDate).toLocaleDateString()
                    : "-"}
                </TableCell>

                <TableCell className="text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      blog.published
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {blog.published ? "Published" : "Unpublished"}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2 sm:gap-3 w-full">
                    <UpdateBlogModal
                      blog={blog}
                      token={tokens?.token as string}
                    />

                    <Button
                      variant={blog.published ? "destructive" : "secondary"}
                      size="sm"
                      onClick={() => togglePublish(blog.slug, blog.published)}
                      className="flex items-center justify-center gap-1 cursor-pointer w-full sm:w-[100px]"
                    >
                      {blog.published ? "Unpublish" : "Publish"}
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
