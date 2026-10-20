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
  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !editor) return;

      try {
        // Show loading state
        const loadingToast = toast.loading('Uploading image...');

        // Upload the image
        const imageUrl = await uploadToImageBB(file);

        // Insert the image into the editor
        editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();

        // Show success message
        toast.success('Image uploaded successfully', {
          id: loadingToast,
        });
      } catch (error) {
        console.error('Image upload failed:', error);
        toast.error('Failed to upload image');
      }
    };
    input.click();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleImageUpload}
      className={editor?.isActive("image") ? "bg-accent text-accent-foreground" : "hover:bg-accent/20"}
      title="Insert Image"
    >
      <Upload className="h-4 w-4" />
    </Button>
  );
}