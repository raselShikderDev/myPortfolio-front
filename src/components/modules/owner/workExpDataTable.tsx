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
import { IWorkExperince } from "@/interfaces/workExperience";
import { format } from "date-fns";
import { UpdateWorkExperienceModal } from "./updateWorkExpModal";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "./deleteWorkExpConfirmModal";

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

export default function WorkExperienceTable({
  workExp = [],
}: {
  workExp?: IWorkExperince[];
}) {
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/work-experience/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: tokens?.token as string,
          },
          credentials: "include",
          next: {
            tags: ["workExp"],
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        toast.error(responseData.message || "Deleting work experience failed");
        return;
      }

      toast.success("Work experience deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete work experience");
    }
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
                    <UpdateWorkExperienceModal workExp={exp} />
                    <DeleteConfirmationModal
                      onConfirm={() => handleDelete(exp.id)}
                    >
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
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
