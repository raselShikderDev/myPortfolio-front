
import Link from "next/link";
import Image from "next/image";
import { IBlog } from "@/interfaces/blogs.interfaces";
import { Badge } from "@/components/ui/badge";
import { MotionDiv } from "../animations/motionElements";

export default function BlogCard({ post }: { post: IBlog }) {
  const authorImage = post.author?.avater as string ? post.author?.avater as string : "https://cdn-icons-png.flaticon.com/512/9385/9385289.png";
  const authorName = post.author?.name || "Owner";

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="w-full"
    >
      <Link
        href={`/blogs/${post.slug}`}
        className="block group rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
      >
        {post.images && post.images.length > 0 ? (
          <div className="relative w-full h-48 sm:h-56 md:h-60 lg:h-64 overflow-hidden">
            <Image
              src={post.images[0]}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="w-full h-48 sm:h-56 md:h-60 lg:h-64 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-300 text-sm sm:text-base">
            No Image Available
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-5 md:p-6 flex flex-col justify-between h-full">
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>

          {/* Description */}
          {post.content && (
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm sm:text-base line-clamp-3">
              {post.content}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-[10px] sm:text-xs"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Author and Views */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Image
                src={authorImage}
                alt={authorName}
                width={36}
                height={36}
                className="rounded-full border-2 border-gray-200 dark:border-gray-700"
              />
              <span className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-1">
                {authorName}
                {post.author?.isVerified && (
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
              </span>
            </div>

            <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm text-right sm:text-left">
              {post.views} views
            </span>
          </div>

          {/* Read More */}
          <div className="text-right mt-auto">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline">
              Read More →
            </span>
          </div>
        </div>
      </Link>
    </MotionDiv>
  );
}
