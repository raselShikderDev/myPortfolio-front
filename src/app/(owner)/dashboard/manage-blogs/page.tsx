import { AddBlogModal } from "@/components/modules/owner/blogs/addBlogModal";
import BlogsTable from "@/components/modules/owner/blogs/blogsDataTable";
import { getUserSession } from "@/lib/getUserSession";

export default async function ManageBlogsPage() {
  const token = await getUserSession();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/all`, {
    next: { tags: ["blogs"] },
  });

  console.log(res);

  if (!res.ok) {
    console.error("Failed to fetch blogs");
  }

  const data = await res.json();
  const blogs = data.data;
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
          <AddBlogModal token={token} />
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <BlogsTable blogs={blogs} />
        </div>
      </section>
    </main>
  );
}
