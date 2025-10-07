
import { useState } from "react";
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

// interface Project {
//   id: string;
//   title: string;
//   techStack: string[];
//   liveUrl: string;
//   githubUrl: string;
// }

export default async function ProjectsTable() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/all`, {
      cache: "no-store",
    });
    console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/all`);
    console.log(res);
  
    const { data: projects }: { data: IProject[] } = await res.json();
    console.log(projects);

  const handleEdit = (id: string) => {
    console.log(`Editing project ${id}`);
  };

  const handleDelete = (id: string) => {
    
    console.log("Project deleted successfully");
  };

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableCaption className="text-sm text-muted-foreground">
          {projects.length > 0
            ? "List of your projects"
            : "No projects found."}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">Title</TableHead>
            <TableHead className="min-w-[180px]">Tech Stack</TableHead>
            <TableHead className="min-w-[150px] hidden sm:table-cell">
              Live URL
            </TableHead>
            <TableHead className="min-w-[150px] hidden md:table-cell">
              GitHub URL
            </TableHead>
            <TableHead className="text-right min-w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                {project.title}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-muted px-2 py-1 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell truncate max-w-[200px]">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  className="text-blue-500 hover:underline text-sm"
                >
                  {project.liveUrl}
                </a>
              </TableCell>
              <TableCell className="hidden md:table-cell truncate max-w-[200px]">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  className="text-blue-500 hover:underline text-sm"
                >
                  {project.githubUrl}
                </a>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(project.id)}
                    className="flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
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
