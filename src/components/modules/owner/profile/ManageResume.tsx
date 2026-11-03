"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/apiConfig";
import { FileMetadata } from "@/hooks/use-file-uploader";
import { uploadToImageBB } from "@/utils/imageUploader";
import SingleResumeUploader from "@/components/ui/SingleResumeUploader";

interface ManageResumeProps {
  currentResumeUrl?: string;
  token: string;
}

function isFile(file: File | FileMetadata): file is File {
  return file instanceof File;
}

export default function ManageResume({
  currentResumeUrl,
  token,
}: ManageResumeProps) {
  const [images, setImages] = useState<(File | FileMetadata)[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!images.length) {
      toast.error("Please select a resume first.");
      return;
    }

    setIsUploading(true);
    const toastId = "resume-upload";

    try {
      // First upload to ImgBB
      let uploadedImageUrls: string[] = [];

      const filesToUpload = images.filter(isFile);

      if (filesToUpload.length > 0) {
        try {
          const uploadPromises = filesToUpload.map((file) =>
            uploadToImageBB(file)
          );

          uploadedImageUrls = await Promise.all(uploadPromises);
        } catch (error: unknown) {
          console.error("ImageBB Upload Error:", error);
          throw new Error("Failed to upload the resume to ImgBB.");
        }
      }

      // Extract the uploaded resume URL
      const resumeUrl = uploadedImageUrls[0];

      if (!resumeUrl) {
        throw new Error("No URL returned from ImgBB.");
      }

      // Then upload the URL to Express backend
      const response = await fetch(`${BASE_URL}/resume/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          resumeUrl,
          fileName: filesToUpload[0].name,
        }),
        credentials: "include",
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(
          responseData.message ||
          responseData.error ||
          "Failed to upload resume."
        );
      }

      toast.success("Resume uploaded successfully.", { id: toastId });
      setImages([]);
    } catch (error: unknown) {
      console.error("Resume Upload Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload resume.",
        { id: toastId }
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Manage Resume</h2>

      {currentResumeUrl && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Current Resume:
          </p>

          <a
            href={currentResumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-blue-500 hover:underline"
          >
            View Current Resume
          </a>
        </div>
      )}

      <div className="space-y-2">
        <SingleResumeUploader onChange={setImages} />

        <Button
          onClick={handleUpload}
          disabled={isUploading || images.length === 0}
          className="cursor-pointer"
        >
          {isUploading ? "Uploading..." : "Upload Resume"}
        </Button>
      </div>
    </div>
  );
}
