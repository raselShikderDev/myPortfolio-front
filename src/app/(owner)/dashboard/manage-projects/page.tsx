// import { getAllProjects } from "@/actions/getProjects";
import { AddProjectModal } from "@/components/modules/owner/addProjectModal";
import ProjectsTable from "@/components/modules/owner/projectDatatable";
import { getUserSession } from "@/lib/getUserSession";

export default async function ProjectShowCasePage() {
  const token = await getUserSession();

  // const projects = await getAllProjects()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/all`);
  const data = await res.json();
  console.log(res);

  const projects = data.data;

  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-10 py-10 space-y-10">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold text-foreground">
          Project Management
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Add, edit, and manage your portfolio projects easily.
        </p>
      </div>
      <section className="w-full max-w-6xl mx-auto bg-card shadow-sm border border-border rounded-2xl p-4 sm:p-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              All Projects
            </h2>
          </div>
          <div>
            <AddProjectModal token={token} />
          </div>
        </div>

        <ProjectsTable projects={projects} />
      </section>
    </main>
  );
}
