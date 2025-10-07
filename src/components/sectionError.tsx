"use client";

import { FiAlertCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";

interface SectionErrorProps {
  error: Error & { digest?: string };
  reset?: () => void;
  className?: string; // optional styling for container
}

export default function SectionError({ error, reset, className }: SectionErrorProps) {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center p-6 border border-red-400 bg-red-50 rounded-xl text-center ${className || ""}`}
    >
      <FiAlertCircle className="text-red-500 text-4xl mb-2 animate-bounce" />

      <h3 className="text-xl font-semibold text-red-600">
        {error.message || "Failed to load data"}
      </h3>

      {error.digest && (
        <p className="mt-1 text-red-400 text-sm">
          Error ID: {error.digest}
        </p>
      )}

      {reset && (
        <Button
          variant="default"
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
          onClick={reset}
        >
          Retry
        </Button>
      )}
    </div>
  );
}
