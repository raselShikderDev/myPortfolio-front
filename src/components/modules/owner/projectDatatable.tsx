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
import { IProject } from "@/interfaces/projects.interfaces";
import Link from "next/link";

export default function ProjectsTable({ projects }: { projects: IProject[] }) {
  const handleEdit = (id: string) => {
    console.log(`Editing project ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log("Project deleted successfully", id);
  };

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableCaption className="text-sm text-muted-foreground">
          {!(projects.length > 0) && "No projects found."}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px] text-center">Title</TableHead>
            <TableHead className="min-w-[150px] hidden sm:table-cell text-center">
              Live URL
            </TableHead>
            <TableHead className="min-w-[150px] hidden md:table-cell text-center">
              GitHub URL
            </TableHead>
            <TableHead className=" min-w-[100px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project: IProject) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  className="hover:underline hover:text-blue-500"
                >
                  {project.title}
                </Link>
              </TableCell>

              <TableCell className="hidden sm:table-cell truncate max-w-[200px]">
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  className="text-blue-500 hover:underline text-sm"
                >
                  {project.liveUrl}
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell truncate max-w-[200px]">
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  className="text-blue-500 hover:underline text-sm"
                >
                  {project.githubUrl}
                </Link>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(String(project.id))}
                    className="flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(String(project.id))}
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
