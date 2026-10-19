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
  return (
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
  );
}