

import { getAllBlogs } from "@/actions/getBlogs";
import { AddBlogModal } from "@/components/modules/owner/addBlogModal";
import BlogsTable from "@/components/modules/owner/blogsDataTable";

export default async function ManageBlogsPage() {
  try {
    const blogs = await getAllBlogs();
    console.log(blogs);

    return (
      <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-10 py-10 space-y-10">
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Blog Management
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Add, edit, publish, or remove your blogs with ease.
          </p>
        </header>

        <section className="w-full max-w-6xl mx-auto bg-card shadow-md border border-border rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              All Blogs
            </h2>
            <AddBlogModal />
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <BlogsTable blogs={blogs} />
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return (
      <main className="min-h-screen flex items-center justify-center text-muted-foreground">
        <p>Failed to load blogs. Please try again later.</p>
      </main>
    );
  }
}
