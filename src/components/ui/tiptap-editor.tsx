"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Editor } from "@tiptap/react";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
} from "lucide-react";
import { forwardRef } from "react";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  ref?: React.Ref<Editor>;
}

export const TiptapEditor = forwardRef((props: TiptapEditorProps, ref: React.Ref<Editor> | null) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4 cursor-pointer",
        },
      }),
      Image.configure({}),
      ],
    content: props.value,
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 overflow-y-auto prose dark:prose-invert max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      if (!text.trim() || html === "<p></p>") {
        props.onChange("");
      } else {
        props.onChange(html);
      }
    },
  });

  // Expose the editor instance to parent components via ref
  useImperativeHandle(
    ref,
    () => editor,
    [editor]
  );

  useEffect(() => {
    if (editor && props.value !== undefined) {
      const currentHtml = editor.getHTML();
      if (props.value !== currentHtml && !(props.value === "" && currentHtml === "<p></p>")) {
        editor.commands.setContent(props.value);
      }
    }
  }, [props.value, editor]);

  // Handle pasting from other websites (text + images)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const clipboardData = e.clipboardData;
      if (!clipboardData || !editor) return;

      // If there are image files in the clipboard, read them as base64 and insert
      if (clipboardData.files && clipboardData.files.length > 0) {
        const file = clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            // Insert image using base64 src
            editor.chain().focus().setImage({ src: base64 }).run();
          };
          reader.readAsDataURL(file);
          return;
        }
      }

      // Try to get HTML first (preserves images from websites)
      const html = clipboardData.getData('text/html');
      if (html) {
        editor.chain().focus().insertContent(html).run();
        return;
      }

      // Fall back to plain text
      const text = clipboardData.getData('text/plain');
      if (text) {
        editor.chain().focus().insertContent(text).run();
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1 rounded-md border border-input bg-muted/50 p-1 relative">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-accent text-accent-foreground" : ""}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-accent text-accent-foreground" : ""}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "bg-accent text-accent-foreground" : ""}
          title="Strike"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "bg-accent text-accent-foreground" : ""}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-accent text-accent-foreground" : ""}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "bg-accent text-accent-foreground" : ""}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="h-4 w-[1px] bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-accent text-accent-foreground" : ""}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-accent text-accent-foreground" : ""}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-accent text-accent-foreground" : ""}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "bg-accent text-accent-foreground" : ""}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="h-4 w-[1px] bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
});