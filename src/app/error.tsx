"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiAlertCircle } from "react-icons/fi";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-950 px-4">
      <div className="max-w-md w-full rounded-xl border border-gray-700 bg-gray-900 dark:bg-gray-950 p-8 shadow-lg flex flex-col items-center text-center">
        <FiAlertCircle className="text-red-500 text-6xl mb-4 animate-bounce" />

        <h2 className="text-2xl sm:text-3xl font-bold text-red-500">
          Oops! Something went wrong
        </h2>

        <p className="mt-2 text-gray-300 sm:text-base text-sm">
          {error.message || "An unexpected error occurred."}
        </p>

        {error.digest && (
          <p className="mt-1 text-gray-500 text-xs sm:text-sm">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-6">
          <Button
            variant="default"
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg transition-transform transform hover:scale-105"
            onClick={() => reset()}
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
