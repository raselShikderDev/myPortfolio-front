import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadToImageBB } from "@/utils/imageUploader";

import { Editor } from "@tiptap/react";
import { Image } from "@tiptap/extension-image";

interface ImageDotTiptapProps {
  editor: Editor | null; // Tiptap editor instance
}

export function ImageDotTiptap({ editor }: ImageDotTiptapProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = async () => {
    if (!imageUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    setIsUploading(true);
    try {
      // For URL-based images, we just validate and use as-is
      // In a more advanced version, you could upload files to ImageBB
      const url = imageUrl.trim();

      // Basic URL validation
      if (!/^https?:\/\//i.test(url)) {
        toast.error("Please enter a valid image URL starting with http:// or https://");
        return;
      }

      // Insert the image at current cursor position
      if (editor) {
        await editor.chain().focus().setImage({ src: url, alt: "Uploaded image" }).run();
      }

      // Close dialog and reset
      setImageUrl("");
      toast.success("Image inserted!");
    } catch (error) {
      console.error("Error inserting image:", error);
      toast.error("Failed to insert image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          // Simple URL input approach
          const url = window.prompt("Enter image URL:", "https://");
          if (url && editor) {
            editor.chain().focus().setImage({ src: url, alt: "Uploaded image" }).run();
          }
        }}
        className={editor?.isActive("image") ? "bg-accent text-accent-foreground" : ""}
        title="Insert Image"
      >
        <Upload className="h-4 w-4" />
      </Button>
    </>
  );
}