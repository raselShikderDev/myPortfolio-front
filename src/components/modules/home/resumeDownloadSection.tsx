
"use client";

import { useEffect, useState } from "react";
import { GoDownload } from "react-icons/go";
import { BASE_URL } from "@/lib/apiConfig";

export default function ResumeDownloadSection() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const response = await fetch(`${BASE_URL}/resume`);

        if (response.status === 404) {
          setResumeUrl(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch resume URL");
        }

        const result = await response.json();
        setResumeUrl(result.data?.resumeUrl || null);
      } catch (error) {
        console.error("Error fetching resume URL:", error);
        setResumeUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumeUrl();
  }, []);

  // Fallback to local PDF if API fails or no resume exists
  const effectiveResumeUrl = resumeUrl || "/rasel_resume.pdf";

  return (
    <a
      href={isLoading ? undefined : effectiveResumeUrl}
      download="Rasel_Shikder_Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={isLoading}
      onClick={(e) => {
        if (isLoading) {
          e.preventDefault();
        }
      }}
      className={`text-lg flex items-center justify-center gap-2 px-5 py-2 sm:px-8 sm:py-2.5 rounded-full border border-gray-500 text-darkhover dark:text-black dark:bg-white shadow-xl transition duration-500 ${isLoading
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : "hover:bg-black/15 hover:text-black dark:hover:bg-darkhover dark:hover:text-white active:scale-105"
        }`}
    >
      My resume
      <GoDownload className="text-lg" />
    </a>
  );
}
