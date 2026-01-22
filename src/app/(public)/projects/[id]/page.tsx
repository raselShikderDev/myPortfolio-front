import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IProject } from "@/interfaces/projects.interfaces";
interface ProjectDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ProjectDetailsPage = async ({ params }: ProjectDetailsPageProps) => {
  const { id } = await params;
  console.log({ id });
  console.log(id);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id}`,
    {
      next: { tags: ["projects"] },
    },
  );
  console.log({ res });

  if (!res.ok) {
    notFound();
  }

  const json = await res.json();
  console.log({ json });

  if (!json?.success || !json?.data) {
    notFound();
  }

  const project: IProject = json.data;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6">{project.title}</h1>

      {/* Image */}
      <div className="relative w-full h-[350px] rounded-xl overflow-hidden mb-8">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
        {project.description}
      </p>

      {/* Tech stack */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="flex gap-4">
        <Link
          href={project.liveUrl}
          target="_blank"
          className="px-5 py-2 rounded-lg bg-black text-white hover:opacity-90"
        >
          Live Preview
        </Link>

        <Link
          href={project.githubUrl}
          target="_blank"
          className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          GitHub Repo
        </Link>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
