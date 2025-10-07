import { AddProjectModal } from "@/components/modules/owner/addProjectModal";
import ProjectsTable from "@/components/modules/owner/projectDatatable";

export default function AddProjectPage() {
  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-10 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold text-foreground">
          Project Management
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Add, edit, and manage your portfolio projects easily.
        </p>
      </div>

      {/* Add Project Section */}
      <section className="w-full max-w-3xl mx-auto bg-card shadow-md border border-border rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6 text-center">
          Add New Project
        </h2>

        <div className="flex justify-center">
          <AddProjectModal />
        </div>
      </section>

      {/* Project List Section */}
      <section className="w-full max-w-6xl mx-auto bg-card shadow-sm border border-border rounded-2xl p-4 sm:p-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            All Projects
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage existing projects below.
          </p>
        </div>

        <ProjectsTable />
      </section>
    </main>
  );
}
