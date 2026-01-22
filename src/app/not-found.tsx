// app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50 dark:bg-gray-900">
      <h1 className="text-6xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
        Page Not Found
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="default" className="px-6 py-3 text-lg">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
}
