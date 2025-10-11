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
import { IProject } from "@/interfaces/projects.interfaces";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UpdateProjectModal } from "./updateProjectModal";
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

export default function ProjectsTable({ projects }: { projects: IProject[] }) {
  const [tokens, setTokens] = useState<null | AuthResponse>(null);
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setTokens(data))
      .catch(console.error);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: tokens?.token as string,
          },
          credentials: "include",
          next: {
            tags: ["projects"],
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        toast.error(responseData.message || "Deleting project failed");
        return;
      }

      toast.success("Project deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableCaption className="text-sm text-muted-foreground">
          {!(projects?.length > 0) && "No projects found."}
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
            <TableHead className=" min-w-[100px] text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects?.map((project: IProject) => (
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
                  <UpdateProjectModal
                    project={project}
                    token={tokens?.token as string}
                  />
                  <DeleteConfirmationModal
                    onConfirm={() => handleDelete(Number(project.id))}
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
