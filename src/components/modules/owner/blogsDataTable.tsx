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
import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { IBlog } from "@/interfaces/blogs.interfaces";

export default function BlogsTable({ blogs }: { blogs: IBlog[] }) {
  const handleEdit = (id: number) => {
    console.log(`Editing blog ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Blog deleted successfully ${id}`);
  };

  const togglePublish = (id: number, currentStatus: boolean) => {
    console.log(
      `${currentStatus ? "Unpublishing" : "Publishing"} blog ${id}`
    );
  };

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableCaption className="text-sm text-muted-foreground">
          {!(blogs.length > 0) && "No blogs found."}
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
          {blogs.map((blog) => (
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
                    blog.published ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {blog.published ? "Published" : "Unpublished"}
                </span>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(blog.id)}
                    className="flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    variant={blog.published ? "destructive" : "secondary"}
                    size="sm"
                    onClick={() => togglePublish(blog.id, blog.published)}
                    className="flex items-center gap-1"
                  >
                    {blog.published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(blog.id)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
