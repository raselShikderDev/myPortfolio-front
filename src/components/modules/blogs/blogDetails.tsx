/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { IBlog } from "@/interfaces/blogs.interfaces";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";

const BlogDetailsCard = ({ blog }: { blog: IBlog }) => {
  const authorName =
    blog.author?.name || (blog as any).authorName || "Rasel Shikder";

  // ✅ Extract plain text from Tiptap JSON (for reading time)
  function extractText(node: any): string {
    if (!node) return "";

    if (node.type === "text") return node.text || "";

    if (node.content) {
      return node.content.map(extractText).join(" ");
    }

    return "";
  }

  const plainText = extractText(blog.content);
  const wordsPerMinute = 200;
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  // ✅ Convert JSON → HTML
  const html = blog.content
    ? generateHTML(blog.content as any, [StarterKit])
    : "<p>No content available</p>";

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      <Card className="overflow-hidden bg-white/90 dark:bg-slate-900/80 shadow-lg">
        {/* Image */}
        {blog.images && blog.images.length > 0 && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-100">
            <Image
              src={blog.images[0]}
              alt={blog.title}
              fill
              className="object-cover w-full h-full"
              priority
            />
          </div>
        )}

        <CardContent className="p-6 sm:p-8">
          <CardHeader className="mb-4 p-0">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {blog.title}
            </CardTitle>
          </CardHeader>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            {blog.publishedDate && (
              <span>
                📅 {format(new Date(blog.publishedDate), "MMMM dd, yyyy")}
              </span>
            )}
            <span>✍ {authorName}</span>
            <span>👁 {blog.views} views</span>
            <span>⏱ {readingTime || 1} min read</span>
            <span>{blog.published ? "✅ Published" : "❌ Draft"}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs sm:text-sm bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* ✅ Rich Content Rendering */}
          <div
            className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetailsCard;





// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { IBlog } from "@/interfaces/blogs.interfaces";
// import Image from "next/image";
// import { format } from "date-fns";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// const BlogDetailsCard = ({ blog }: { blog: IBlog }) => {
//   const authorName =
//     blog.author?.name || (blog as any).authorName || "Rasel Shikder";

//   const wordsPerMinute = 200;
//   const contentString = String(blog.content || "");
//   const wordCount = contentString.split(/\s+/).length;
//   const readingTime = Math.ceil(wordCount / wordsPerMinute);

//   return (
//     <div className="w-full max-w-4xl mx-auto my-6">
//       <Card className="overflow-hidden bg-white/90 dark:bg-slate-900/80 shadow-lg">
//         {/* Image */}
//         {blog.images && blog.images.length > 0 && (
//           <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-100">
//             <Image
//               src={blog.images[0]}
//               alt={blog.title}
//               fill
//               className="object-cover w-full h-full"
//               priority
//             />
//           </div>
//         )}

//         <CardContent className="p-6 sm:p-8">
//           <CardHeader className="mb-4 p-0">
//             {" "}
//             {/* Adjusted padding */}
//             <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
//               {blog.title}
//             </CardTitle>
//           </CardHeader>

//           {/* Metadata */}
//           <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
//             {blog.publishedDate && (
//               <span>
//                 📅 {format(new Date(blog.publishedDate), "MMMM dd, yyyy")}
//               </span>
//             )}
//             {/* authorName is now correctly defined and used */}
//             {authorName && <span>✍ {authorName}</span>}
//             <span>👁 {blog.views} views</span>
//             <span>⏱ {readingTime} min read</span>
//             <span>{blog.published ? "✅ Published" : "❌ Draft"}</span>
//           </div>

//           {/* Tags */}
//           <div className="flex flex-wrap gap-2 mb-4">
//             {blog.tags?.map((tag, idx) => (
//               <span
//                 key={idx}
//                 className="text-xs sm:text-sm bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full font-medium"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>

//           {/* Content */}
//           <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
//             {blog.content}
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default BlogDetailsCard;
