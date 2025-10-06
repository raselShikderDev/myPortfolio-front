"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IBlog } from "@/interfaces/blogs.interfaces";

export default function BlogDetailsCard({ blog }: { blog: IBlog }) {
  if (!blog) {
    return (
      <div className="py-20 text-center text-gray-500 dark:text-gray-400">
        Blog not found.
      </div>
    );
  }

  const authorName = blog.author?.name || "Owner";
  const authorImage = "https://cdn-icons-png.flaticon.com/512/9385/9385289.png";

  return (
    <main className="max-w-4xl mx-auto py-16 px-4 md:px-6 lg:px-8">
      {/* Title Section */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight"
      >
        {blog.title}
      </motion.h1>

      {/* Author Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
      >
        <div className="flex items-center gap-4">
          <Image
            src={authorImage}
            alt={authorName}
            width={48}
            height={48}
            className="rounded-full border border-gray-200 dark:border-gray-700"
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
              {authorName}
              {blog.author && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {new Date(blog.createdAt).toLocaleDateString()} • {blog.views}{" "}
              views
            </p>
          </div>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag:string, index:number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </motion.div>

      <Separator className="mb-8" />

      {/* Thumbnail */}
      {blog.images[0] && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative h-56 sm:h-72 md:h-96 w-full overflow-hidden rounded-2xl shadow-md mb-10"
        >
          <Image
            src={blog.images[0]}
            alt={blog.title}
            fill
            priority
            className="object-cover hover:scale-110 transition-transform duration-700"
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        viewport={{ once: true, amount: 0.2 }}
        className="prose dark:prose-invert max-w-none prose-lg sm:prose-xl leading-relaxed"
      >
        <p>{blog.content}</p>
      </motion.article>
    </main>
  );
}
