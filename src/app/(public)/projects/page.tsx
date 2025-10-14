import { MotionH2, MotionP } from "@/components/modules/animations/motionElements";
import ProjectCard from "@/components/modules/projects/projectCard";
import { ExperienceCard } from "@/components/modules/projects/workExperiencecard";
import { IProject } from "@/interfaces/projects.interfaces";
import { IWorkExperince } from "@/interfaces/workExperience";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Rasel Shikder",
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
    "Node.js",
    "MongoDB",
    "PostgresSQL",
    "Prisma",
    "MERN Stack",
    "Mongoose",
  ],
};

const ProjectsPage = async () => {
  let projectsData: IProject[] = [];
  let experiencesData: IWorkExperince[] = [];

  try {
    const [projectsRes, experiencesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/all`, { next: { tags: ["projects"] } }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/work-experience/all`, { next: { tags: ["workExp"] } }),
    ]);

    if (projectsRes.ok) {
      const projectsJson = await projectsRes.json();
      projectsData = projectsJson?.data || [];
    }

    if (experiencesRes.ok) {
      const experiencesJson = await experiencesRes.json();
      experiencesData = experiencesJson?.data || [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <div className="w-full px-[12%] py-10 md:mt-0 scroll-mt-20 mx-auto">
      <MotionH2
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="text-2xl md:text-5xl font-ovo ovo text-center"
      >
        My works
      </MotionH2>
      <MotionP
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="max-w-3xl sm:text-lg dark:text-gray-300 text-sm mx-auto mt-4 font-ovo ovo text-center"
      >
        Explore my collection of MERN stack projects, where modern design meets responsive, full-stack functionality and cutting-edge web technologies.
      </MotionP>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 my-16 mt-10">
        {projectsData.length > 0 ? (
          projectsData.map((project, index) => (
            <div key={index} className="flex">
              <ProjectCard {...project} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No projects available at the moment.</p>
        )}
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">Work Experience</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch">
            {experiencesData.length > 0 ? (
              experiencesData.map((exp, index) => (
                <div key={index} className="flex">
                  <ExperienceCard
                    companyName={exp.companyName}
                    role={exp.role}
                    description={exp.descreption}
                    startDate={exp.startDate || null}
                    endDate={exp.endDate || null}
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">No work experience available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
