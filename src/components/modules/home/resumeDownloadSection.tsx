"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GoDownload } from "react-icons/go";
import { BASE_URL } from "@/lib/apiConfig";

export default function ResumeDownloadSection() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const response = await fetch(`${BASE_URL}/resume`);

        if (!response.ok) {
          // If no resume exists, use fallback
          if (response.status === 404) {
            setResumeUrl(null);
          } else {
            throw new Error('Failed to fetch resume URL');
          }
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

  // Fallback to local PDF if API fails
  const fallbackResumeUrl = "/rasel_resume.pdf";

  if (isLoading) {
    return (
      <Button size="lg" disabled>
        <GoDownload className="h-4 w-4" />
        Loading...
      </Button>
    );
  }

  // Use API URL if available, otherwise fall back to local file
  const effectiveResumeUrl = resumeUrl || fallbackResumeUrl;

  return (
    <>
      {!resumeUrl ? (
        <a
          href={effectiveResumeUrl}
          download="Rasel_Shikder_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg flex items-center justify-center gap-2 px-5 py-2 sm:px-8 sm:py-2.5 rounded-full border border-gray-500 text-darkhover dark:text-black dark:bg-white hover:bg-black/15 hover:text-black dark:hover:bg-darkhover dark:hover:text-white shadow-xl transition duration-500 active:scale-105"
        >
          My resume <GoDownload className="text-lg" />
        </a>
      ) : (
        // API URL provided - open in new tab to avoid CORS issues with download attribute
        <a
          href={effectiveResumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          download="Rasel_Shikder_Resume.pdf"
          className="text-lg flex items-center justify-center gap-2 px-5 py-2 sm:px-8 sm:py-2.5 rounded-full border border-gray-500 text-darkhover dark:text-black dark:bg-white hover:bg-black/15 hover:text-black dark:hover:bg-darkhover dark:hover:text-white shadow-xl transition duration-500 active:scale-105"
        >
          My resume <GoDownload className="text-lg" />
        </a>
      )}
    </>
  );
}