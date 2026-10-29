1	'use client';
2
3	import { useEditor, EditorContent } from "@tiptap/react";
4	import StarterKit from "@tiptap/starter-kit";
5	import { Editor } from "@tiptap/react";
6	import Link from "@tiptap/extension-link";
7	import Image from "@tiptap/extension-image";
8	import { useState, useEffect } from "react";
9	import { Button } from "@/components/ui/button";
10	import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Undo, Redo } from "lucide-react";
11
12	export default function TestTiptapPage() {
13	  const [editor, setEditor] = useState<Editor | null>(null);
14	  const [content, setContent] = useState('');
15
16	  useEffect(() => {
17	    const newEditor = useEditor({
18	      extensions: [
19	        StarterKit.configure({ link: false }),
20	      Link.configure({
21	        openOnClick: false,
22	      }),
23	      Image.configure({}),
24	    ],
25	      content: '',
26	      onUpdate: ({ editor }) => {
27	        const html = editor.getHTML();
28	        const text = editor.getText();
29	        setContent(html);
30	      },
31	    });
32
33	    setEditor(newEditor);
34
35	    return () => {
36	      if (newEditor) {
37	        newEditor.destroy();
38	    }

39	  }, []);
40	  }, []);
41
42	  const toggleFormat = (command: string, args?: any) => {
43	    if (!editor) return;
44
45	    switch (command) {
46	      case 'bold':
47	        editor.chain().focus().toggleBold().run();
48	        break;
49	      case 'italic':
50	        editor.chain().focus().toggleItalic().run();
51	        break;
52	      case 'strike':
53	        editor.chain().focus().toggleStrike().run();
54	        break;
55	      case 'heading1':
56	        editor.chain().focus().toggleHeading({ level: 1 }).run();
57	        break;
58	      case 'heading2':
59	        editor.chain().focus().toggleHeading({ level: 2 }).run();
60	        break;
61	      case 'heading3':
62	        editor.chain().focus().toggleHeading({ level: 3 }).run();
63	        break;
64	      case 'bulletList':
65	        editor.chain().focus().toggleBulletList().run();
66	        break;
67	      case 'orderedList':
68	        editor.chain().focus().toggleOrderedList().run();
69	        break;
70	      case 'blockquote':
71	        editor.chain().focus().toggleBlockquote().run();
72	        break;
73	      case 'codeBlock':
74	        editor.chain().focus().toggleCodeBlock().run();
75	        break;
76	    }
77	  };
78
79	  return (
80	    <div className="flex flex-col gap-4 p-4">
81	      <h1>Test Tiptap Editor - All Formatting Options</h1>
82
83	      <div className="flex flex-wrap gap-2">
84	        <Button onClick={() => toggleFormat('bold')} className="w-20">Bold</Button>
85	        <Button onClick={() => toggleFormat('italic')} className="w-20">Italic</Button>
86	        <Button onClick={() => toggleFormat('strike')} className="w-20">Strike</Button>
87	        <Button onClick={() => toggleFormat('heading1')} className="w-20">H1</Button>
88	        <Button onClick={() => toggleFormat('heading2')} className="w-20">H2</Button>
89	        <Button onClick={() => toggleFormat('heading3')} className="w-20">H3</Button>
90	        <Button onClick={() => toggleFormat('bulletList')} className="w-20">Bullet List</Button>
91	        <Button onClick={() => toggleFormat('orderedList')} className="w-20">Ordered List</Button>
92	        <Button onClick={() => toggleFormat('blockquote')} className="w-20">Blockquote</Button>
93	        <Button onClick={() => toggleFormat('codeBlock')} className="w-20">Code Block</Button>
94	      </div>
95
96	      <div className="p-2 border rounded">
97	        <EditorContent editor={editor} className="min-h-[200px]" />
98	      </div>
99
100	     <div className="p-2 bg-gray-100 rounded">
101	       <h3>HTML Output:</h3>
102	       <pre className="text-xs font-mono whitespace-pre-wrap">{content}</pre>
103	     </div>
104	   </div>
105	  );
106	}