import { IProject } from "@/interfaces/projects.interfaces";
import { IBlog } from "@/interfaces/blogs.interfaces";
import { IWorkExperince } from "@/interfaces/workExperience";

/**
 * Fallback data for portfolio page sections
 * Used when external API is unavailable
 */

// Fallback project data - adapted from existing projectsData in assets.tsx
// Converting to IProject interface
export const fallbackProjects: IProject[] = [
  {
    id: 1,
    title: "MERN Library Manager",
    description:
      "A full-featured library system built with the MERN stack, featuring authentication, book borrowing, and admin controls.",
    image: "/work-1.png",
    techStack: ["React", "Node.js", "Express", "MongoDB", "TypeScript"],
    liveUrl: "https://libraryapp.vercel.app",
    githubUrl: "https://github.com/raselshikder/library-system",
    userId: 1,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: 2,
    title: "AI Blog Generator",
    description:
      "An AI-powered content generation app that helps users create SEO-friendly blog posts using OpenAI APIs.",
    image: "/work-2.png",
    techStack: ["Next.js", "TypeScript", "OpenAI API", "TailwindCSS"],
    liveUrl: "https://aiblog.vercel.app",
    githubUrl: "https://github.com/raselshikder/aiblog",
    userId: 1,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-05-01"),
  },
];

// Fallback blog data
// Note: No existing blog content found in repository content.
// Fall back to empty array when API fails for blogs.
export const fallbackBlogs: IBlog[] = [];

// Fallback work experience data - from existing experiencesData in assets.tsx
export const fallbackExperiences: IWorkExperince[] = [
  {
    id: 1,
    companyName: "TechNova Labs",
    role: "MERN Stack Developer",
    descreption:
      "Built and maintained scalable web applications using MongoDB, Express, React, and Node.js. Collaborated with cross-functional teams to deliver high-performance solutions.",
    userId: 1,
    startDate: new Date("2022-03-01"),
    endDate: new Date("2024-07-01"),
  },
  {
    id: 2,
    companyName: "Codeverse Solutions",
    role: "Frontend Engineer",
    descreption:
      "Developed modern, responsive UIs using React, TailwindCSS, and TypeScript. Improved performance, accessibility, and overall user experience across devices.",
    userId: 1,
    startDate: new Date("2021-01-01"),
    endDate: new Date("2022-02-01"),
  },
];