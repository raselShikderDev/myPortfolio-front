// src/components/AddProjectModal.tsx (or wherever your component resides)
"use client";

import SingleFileImageUploader from "@/components/singelFileuploader";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// 💡 IMPORTANT: Replace with your actual project API mutation if needed for a real API call.
// import { useAddProjectMutation } from "@/redux/features/project/project.api"; 
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// --- 1. Define Types for Project Form ---
interface ProjectFormValues {
  title: string;
  description: string;
  techStack: string; // The raw comma-separated string from the input
  liveUrl: string;
  githubUrl: string;
}

// --- 2. Main Component Renamed ---
export function AddProjectModal() {
  const [image, setImage] = useState<File | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<ProjectFormValues>({
    defaultValues: {
      title: "",
      description: "",
      techStack: "",
      liveUrl: "",
      githubUrl: "",
    },
  });
  const onsubmit = async (data: ProjectFormValues) => {
    const processedTechStack = data.techStack
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean);

    // Create the final data object for logging/API
    const finalProjectData = {
      ...data,
      techStack: processedTechStack, // Array of strings
      image: image ? image.name : null, // Logging the file name for clarity
    };
    
    // --- CONSOLE LOGGING AS REQUESTED ---
    console.log("🚀 Project Form Data:", data);
    console.log("🖼️ Image File:", image);
    console.log("✅ FINAL PROCESSED PROJECT DATA:", finalProjectData);
    // ------------------------------------

    // Simulate async operation and toast feedback
    const toastId = toast.loading("Adding project...");
    
    // In a real application, you would typically use FormData here:
    /*
    const formData = new FormData();
    formData.append("data", JSON.stringify({...data, techStack: processedTechStack}));
    if (image) formData.append("file", image);
    
    try {
      const res = await addProject(formData).unwrap();
      // ... handle success and failure ...
    }
    */

    setTimeout(() => {
        toast.success("Project data logged to console.", { id: toastId });
        setOpen(false);
        form.reset();
        setImage(null); // Reset image state
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="cursor-pointer">
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-5"
            id="add-project" // Changed from 'add-division'
            onSubmit={form.handleSubmit(onsubmit)}
          >
            
            {/* --- Project Title Field (was 'name') --- */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Project Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- Project Description Field (unchanged name) --- */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Project Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* --- New Field: Tech Stack --- */}
            <FormField
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Tech Stack (e.g., React, Node.js)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* --- New Field: Live URL --- */}
            <FormField
              control={form.control}
              name="liveUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Live Site URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* --- New Field: GitHub URL --- */}
            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="GitHub Repository URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </form>
          <SingleFileImageUploader onChange={setImage} />
        </Form>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button className="cursor-pointer" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="cursor-pointer"
            type="submit"
            form="add-project" // Changed from 'add-division'
            disabled={form.formState.isSubmitting}
          >
            Save Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}