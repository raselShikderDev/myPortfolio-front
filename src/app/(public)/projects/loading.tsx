import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsLoading() {
  return (
    <div className="w-full px-[12%] py-10 md:mt-0 scroll-mt-20 mx-auto">
      {/* Page Title & Subtitle Skeletons */}
      <div className="flex flex-col items-center space-y-4 mb-16">
        <Skeleton className="h-10 md:h-12 w-48 rounded-md" />
        <Skeleton className="h-5 w-full max-w-3xl rounded-md" />
        <Skeleton className="h-5 w-2/3 max-w-xl rounded-md" />
      </div>

      {/* Projects Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 my-16 mt-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col h-full border border-border rounded-2xl p-4 bg-white/90 dark:bg-slate-900/80 shadow-md space-y-4">
            {/* Image Placeholder */}
            <Skeleton className="w-full h-52 rounded-xl" />
            {/* Title Placeholder */}
            <Skeleton className="h-6 w-3/4 rounded-md" />
            {/* Description Placeholder */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>
            {/* Tech Stack Badges Placeholder */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Work Experience Section Skeleton */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex justify-center mb-6">
            <Skeleton className="h-8 w-60 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col w-full border border-border rounded-xl p-6 bg-white/90 dark:bg-slate-900/80 shadow-sm space-y-4">
                <Skeleton className="h-6 w-1/2 rounded-md" />
                <Skeleton className="h-4 w-1/3 rounded-md" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-4/5 rounded-md" />
                </div>
                <Skeleton className="h-3 w-28 rounded-md pt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
