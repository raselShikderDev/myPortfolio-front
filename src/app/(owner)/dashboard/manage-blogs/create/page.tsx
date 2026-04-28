"use client";

import { useState } from "react";
import RichEditor from "@/components/editor/RichEditor";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<any>(null);

  const handleSubmit = async () => {
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <input
        className="w-full border p-2"
        placeholder="Blog title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <RichEditor value={content} onChange={setContent} />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2"
      >
        Publish
      </button>
    </div>
  );
}