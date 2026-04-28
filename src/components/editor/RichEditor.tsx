"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function Toolbar({ editor }: any) {
  if (!editor) return null;

  return (
    <div className="flex gap-2 mb-2 border-b pb-2">
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </button>

      <button onClick={() => editor.chain().focus().toggleItalic().run()}>
        Italic
      </button>

      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </button>

      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        List
      </button>
    </div>
  );
}

export default function RichEditor({ value, onChange }: any) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-lg p-3">
      <Toolbar editor={editor} /> {/*  Step 3 goes here */}
      <EditorContent editor={editor} />
    </div>
  );
}