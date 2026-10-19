const { useEditor, EditorContent } = TiptapReact;
const StarterKit = TiptapStarterKit;
const Link = TiptapLink;
const Image = TiptapImage;

// Create editor instance
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
  content: '',
  editorProps: {
    attributes: {
      class: "min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 overflow-y-auto prose dark:prose-invert max-w-none",
    },
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    console.log('Editor HTML:', html);
  },
});

export default editor;