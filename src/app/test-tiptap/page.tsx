"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Editor } from "@tiptap/react";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Undo, Redo } from "lucide-react";

export default function TestTiptapPage() {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    const newEditor = new Editor({
      extensions: [
        StarterKit.configure({ link: false }),
        Link.configure({
          openOnClick: false,
        }),
        Image.configure({}),
      ],
      content: '',
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        setContent(html);
      },
    });

    setEditor(newEditor);

    return () => {
      if (newEditor) {
        newEditor.destroy();
      }
    };
  }, []);

  const toggleFormat = (command: string, args?: Record<string, unknown>) => {
    if (!editor) return;

    switch (command) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'strike':
        editor.chain().focus().toggleStrike().run();
        break;
      case 'heading1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'heading2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'heading3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'codeBlock':
        editor.chain().focus().toggleCodeBlock().run();
        break;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1>Test Tiptap Editor - All Formatting Options</h1>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toggleFormat('bold')} className="w-20">Bold</Button>
        <Button onClick={() => toggleFormat('italic')} className="w-20">Italic</Button>
        <Button onClick={() => toggleFormat('strike')} className="w-20">Strike</Button>
        <Button onClick={() => toggleFormat('heading1')} className="w-20">H1</Button>
        <Button onClick={() => toggleFormat('heading2')} className="w-20">H2</Button>
        <Button onClick={() => toggleFormat('heading3')} className="w-20">H3</Button>
        <Button onClick={() => toggleFormat('bulletList')} className="w-20">Bullet List</Button>
        <Button onClick={() => toggleFormat('orderedList')} className="w-20">Ordered List</Button>
        <Button onClick={() => toggleFormat('blockquote')} className="w-20">Blockquote</Button>
        <Button onClick={() => toggleFormat('codeBlock')} className="w-20">Code Block</Button>
      </div>

      <div className="p-2 border rounded">
        <EditorContent editor={editor} className="min-h-[200px]" />
      </div>

     <div className="p-2 bg-gray-100 rounded">
       <h3>HTML Output:</h3>
       <pre className="text-xs font-mono whitespace-pre-wrap">{content}</pre>
     </div>
   </div>
  );
}
