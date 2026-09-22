import { Skeleton } from "@/components/ui/skeleton";

export default function BlogsLoading() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Title Skeleton */}
      <div className="flex justify-center mb-8">
        <Skeleton className="h-10 sm:h-12 w-44 rounded-md" />
      </div>

      {/* Blogs Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800"
          >
            {/* Image Placeholder */}
            <Skeleton className="w-full h-48 sm:h-56 md:h-60 lg:h-64 rounded-none" />

            {/* Content Container */}
            <div className="p-4 sm:p-5 md:p-6 flex flex-col justify-between flex-1 space-y-4">
              {/* Title */}
              <Skeleton className="h-6 w-5/6 rounded-md" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>

              {/* Author and Views */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
                <Skeleton className="h-4 w-14 rounded-md" />
              </div>

              {/* Read More */}
              <div className="flex justify-end pt-2">
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
