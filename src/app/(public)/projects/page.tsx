// import { assets, workData } from "@/assets/assets";
import {
  MotionDiv,
  MotionH2,
  MotionP,
} from "@/components/modules/animations/motionElements";
import ProjectCard from "@/components/modules/projects/projectCard";
import { ExperienceCard } from "@/components/modules/projects/workExperiencecard";
import { IProject } from "@/interfaces/projects.interfaces";
import { Metadata } from "next";
// import Image from "next/image";
import Link from "next/link";
import { MdArrowRightAlt } from "react-icons/md";

export const metadata: Metadata = {
  title: "Projects | Your Name",
  description:
    "Showcasing my best projects built with React, Next.js, and Node.js.",
  keywords: [
    "Projects",
    "Rasel Shikder",
    "Full-stack developer",
    "Portfolio",
    "Next.js",
    "TypeScript",
    "React",
    "Portfolio",
    "Node.js",
    "MongoDB",
    "PostgresSQL",
    "Prisma",
    "MERN Stack",
    "Mongoose",
  ],
};

// const projectsData = [
//   {
//     title: "MERN Library Manager",
//     description:
//       "A full-featured library system built with the MERN stack, featuring authentication, book borrowing, and admin controls.",
//     image: "/projects/library.png",
//     techStack: ["React", "Node.js", "Express", "MongoDB", "TypeScript"],
//     liveUrl: "https://libraryapp.vercel.app",
//     githubUrl: "https://github.com/raselshikder/library-system",
//   },
//   {
//     title: "AI Blog Generator",
//     description:
//       "An AI-powered content generation app that helps users create SEO-friendly blog posts using OpenAI APIs.",
//     image: "/projects/aiblog.png",
//     techStack: ["Next.js", "TypeScript", "OpenAI API", "TailwindCSS"],
//     liveUrl: "https://aiblog.vercel.app",
//     githubUrl: "https://github.com/raselshikder/aiblog",
//   },
//   // Add more projects dynamically...
// ];

const experiences = [
  {
    companyName: "TechNova Labs",
    role: "MERN Stack Developer",
    description:
      "Built and maintained scalable web applications using MongoDB, Express, React, and Node.js. Collaborated with cross-functional teams to deliver high-performance solutions.",
    startDate: new Date("2022-03-01"),
    endDate: new Date("2024-07-01"),
  },
  {
    companyName: "Codeverse Solutions",
    role: "Frontend Engineer",
    description:
      "Developed modern, responsive UIs using React, TailwindCSS, and TypeScript. Improved performance, accessibility, and overall user experience across devices.",
    startDate: new Date("2021-01-01"),
    endDate: new Date("2022-02-01"),
  },
];

const ProjectsPage = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/all`, {
    cache: "no-store",
  });
  console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/all`);
  console.log(res);

  const { data: projectsData }: { data: IProject[] } = await res.json();
  console.log(projectsData);

  return (
    <div className="w-full px-[12%] py-10 md:mt-0 scroll-mt-20 mx-auto">
      <MotionH2
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 100, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="text-2xl md:text-5xl font-ovo ovo text-center"
      >
        My works
      </MotionH2>
      <MotionP
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 100, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="max-w-3xl sm:text-lg dark:text-gray-300 text-sm mx-auto mt-4 font-ovo ovo text-center"
      >
        Explore my collection of MERN stack projects, where modern design meets
        responsive, full-stack functionality and cutting-edge web technologies.
      </MotionP>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 my-16 mt-10">
        {projectsData.map((project, index) => (
          <div key={index} className="flex">
            <ProjectCard
              title={project.title}
              description={project.description}
              image={project.image}
              techStack={project.techStack}
              liveUrl={project.liveUrl}
              githubUrl={project.githubUrl}
            />
          </div>
        ))}
      </div>
      <MotionDiv
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 100, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Link
          className="flex w-max mx-auto text-center gap-2 items-center active:scale-105 px-5 sm:px-10 py-1 sm:py-2.5 font-ovo my-20 border dark:hover:text-black duration-500 hover:bg-lighthover border-gray-700 rounded-full"
          href={"#"}
        >
          Show more <MdArrowRightAlt />
        </Link>
      </MotionDiv>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">
            Work Experience
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch">
            {experiences.map((exp, index) => (
              <div key={index} className="flex">
                <ExperienceCard
                  companyName={exp.companyName}
                  role={exp.role}
                  description={exp.description}
                  startDate={exp.startDate}
                  endDate={exp.endDate}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
