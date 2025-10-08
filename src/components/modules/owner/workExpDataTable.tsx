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
import { IWorkExperince } from "@/interfaces/workExperience";
import { format } from "date-fns";

export default function WorkExperienceTable({
  workExp = [],
}: {
  workExp?: IWorkExperince[]; // optional to prevent crashes
}) {

    console.log(workExp);
    
  const handleEdit = (id: string | number) => {
    console.log(`Editing work experience ${id}`);
  };

  const handleDelete = (id: string | number) => {
    console.log("Work experience deleted successfully", id);
  };

  const hasData = Array.isArray(workExp) && workExp.length > 0;

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableCaption className="text-sm text-muted-foreground">
          {!hasData && "No work experience found."}
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="text-center min-w-[150px]">Company</TableHead>
            <TableHead className="text-center min-w-[150px]">Role</TableHead>
            <TableHead className="hidden sm:table-cell text-center min-w-[250px]">
              Description
            </TableHead>
            <TableHead className="hidden md:table-cell text-center min-w-[150px]">
              Start Date
            </TableHead>
            <TableHead className="hidden md:table-cell text-center min-w-[150px]">
              End Date
            </TableHead>
            <TableHead className="text-center min-w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {hasData &&
            workExp.map((exp: IWorkExperince) => (
              <TableRow key={exp.id || exp.companyName}>
                <TableCell className="font-medium text-center">
                  {exp.companyName}
                </TableCell>
                <TableCell className="text-center">{exp.role}</TableCell>
                <TableCell className="hidden sm:table-cell truncate max-w-[250px] text-center">
                  {exp.descreption}
                </TableCell>
                <TableCell className="hidden md:table-cell text-center">
                  {exp.startDate
                    ? format(new Date(exp.startDate), "MMM yyyy")
                    : "—"}
                </TableCell>
                <TableCell className="hidden md:table-cell text-center">
                  {exp.endDate
                    ? format(new Date(exp.endDate), "MMM yyyy")
                    : "Present"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(String(exp.id))}
                      className="flex items-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(String(exp.id))}
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
