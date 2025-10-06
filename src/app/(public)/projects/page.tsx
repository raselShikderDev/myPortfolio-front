// import { assets, workData } from "@/assets/assets";
import {
  MotionDiv,
  MotionH2,
  MotionP,
} from "@/components/modules/animations/motionElements";
import ProjectCard from "@/components/modules/projects/projectCard";
import { ExperienceCard } from "@/components/modules/projects/workExperiencecard";
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

const Projects = () => {
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
      {/* <div className="grid grid-cols-1 my-16 mt-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 items-center">
        {workData.map(({ bgImage, title, description, delay, link }, index) => {
          return (
            <MotionDiv
              style={{
                fontFamily: "Ovo, serif",
                backgroundImage: `url(${bgImage})`,
              }}
              key={index}
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 100, x: 0 }}
              transition={{ duration: 1, delay: delay }}
              className="aspect-square bg-no-repeat bg-center bg-cover rounded-lg relative cursor-pointer group"
            >
              <div className="flex gap-2 justify-between items-center w-10/12 rounded-md bg-white text-black absolute bottom-5 left-1/2 -translate-x-1/2 px-5 py-3 duration-500 group-hover:bottom-7">
                <Link target="_blank" href={link}>
                  <div className="">
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-gray-700">{description}</p>
                  </div>
                </Link>
                <div className="flex items-center justify-center rounded-full w-9 border border-black shadow-[2px_2px_0px_#000] aspect-square group-hover:bg-lime-300 transition">
                  <Image
                    src={assets.send_icon}
                    alt="Send Icon"
                    className="w-5"
                  />
                </div>
              </div>
            </MotionDiv>
          );
        })} 
      </div> */}
      <div className="grid grid-cols-1 my-16 mt-10 sm:grid-cols-2 xl:grid-cols-2 gap-6 items-center">
        {/* <ProjectCard/> */}
        <ProjectCard
          title="MERN Library Manager"
          description="A full-featured library system built with the MERN stack, featuring authentication, book borrowing, and admin controls."
          image="/projects/library.png"
          techStack={["React", "Node.js", "Express", "MongoDB", "TypeScript"]}
          liveUrl="https://libraryapp.vercel.app"
          githubUrl="https://github.com/raselshikder/library-system"
        />
        <ProjectCard
          title="AI Blog Generator"
          description="An AI-powered content generation app that helps users create SEO-friendly blog posts using OpenAI APIs."
          image="/projects/aiblog.png"
          techStack={["Next.js", "TypeScript", "OpenAI API", "TailwindCSS"]}
          liveUrl="https://aiblog.vercel.app"
          githubUrl="https://github.com/raselshikder/aiblog"
        />
        <ProjectCard
          title="ShopSmart – E-Commerce Platform"
          description="A responsive e-commerce web app with product search, filters, secure checkout, and admin product management."
          image="/projects/shopsmart.png"
          techStack={["React", "Node.js", "Express", "MongoDB", "Stripe API"]}
          liveUrl="https://shopsmart.vercel.app"
          githubUrl="https://github.com/raselshikder/shopsmart"
        />
        <ProjectCard
          title="TeamCollab – Project Management App"
          description="A real-time project management tool for teams. Features task tracking, Kanban boards, team chat, and role-based access built with the MERN stack."
          image="/projects/teamcollab.png"
          techStack={[
            "Next.js",
            "React",
            "Node.js",
            "Express",
            "MongoDB",
            "Socket.io",
          ]}
          liveUrl="https://teamcollab.vercel.app"
          githubUrl="https://github.com/raselshikder/teamcollab"
        />
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
            <div className="flex">
              <ExperienceCard
                companyName="TechNova Labs"
                role="MERN Stack Developer"
                description="Built and maintained scalable web applications using MongoDB, Express, React, and Node.js. Collaborated with cross-functional teams to deliver high-performance solutions."
                startDate={new Date("2022-03-01")}
                endDate={new Date("2024-07-01")}
              />
            </div>

            <div className="flex">
              <ExperienceCard
                companyName="Codeverse Solutions"
                role="Frontend Engineer"
                description="Developed modern, responsive UIs using React, TailwindCSS, and TypeScript. Improved performance, accessibility, and overall user experience across devices."
                startDate={new Date("2021-01-01")}
                endDate={new Date("2022-02-01")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
