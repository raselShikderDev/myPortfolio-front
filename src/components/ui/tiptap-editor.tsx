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
import { toast } from "sonner";
import { uploadToImageBB } from "../../utils/imageUploader";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  ref?: React.Ref<Editor>;
}

export const TiptapEditor = forwardRef((props: TiptapEditorProps, ref: React.Ref<Editor> | null) => {
  TiptapEditor.displayName = 'TiptapEditor';
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
      handlePaste(view, event) {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        // Handle image files in clipboard
        if (clipboardData.files && clipboardData.files.length > 0) {
          const file = clipboardData.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            const uploadImage = async () => {
              try {
                const loadingToast = toast.loading('Uploading pasted image...');
                const imageUrl = await uploadToImageBB(file);
                editor?.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();
                toast.success('Pasted image uploaded successfully', { id: loadingToast });
              } catch (error) {
                console.error('Pasted image upload failed:', error);
                toast.error('Failed to upload pasted image');
              }
            };
            uploadImage();
            return true;
          }
        }

        // Handle HTML content
        const html = clipboardData.getData('text/html');
        if (html) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;

          const dangerousElements = tempDiv.querySelectorAll('script, iframe, object, embed');
          if (dangerousElements.length > 0) {
            event.preventDefault();
            console.warn('Blocked pasting potentially dangerous HTML content');
            const text = clipboardData.getData('text/plain');
            if (text) {
              editor?.chain().focus().insertContent(text).run();
            }
            return true;
          }
          return false; // Let Tiptap handle safe HTML
        }

        return false; // Let Tiptap handle plain text
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
          className={editor.isActive('bold') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/20'}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/20'}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/20'}
          title="Strike"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <div className="h-4 w-[1px] bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/20'}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/20'}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/20'}
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
          className={editor.isActive('bulletList') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/20'}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/20'}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/20'}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/20'}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="h-4 w-[1px] bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = window.prompt('Enter URL for link');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={editor.isActive('link') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/20'}
          title="Link"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
          </svg>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setImage({ src: "https://via.placeholder.com/600x400" }).run()}
          className={editor.isActive('image') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/20'}
          title="Image"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </Button>
        <div className="h-4 w-[1px] bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={editor.can().undo() ? 'hover:bg-accent/20' : 'opacity-50'}
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
          className={editor.can().redo() ? 'hover:bg-accent/20' : 'opacity-50'}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
});