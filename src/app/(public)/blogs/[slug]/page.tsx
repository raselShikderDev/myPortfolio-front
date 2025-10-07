import BlogDetailsCard from "@/components/modules/blogs/blogDetails";
import { IBlog } from "@/interfaces/blogs.interfaces";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/blogs/${slug}`);
  const result = await res.json();
  const blog: IBlog = result.data;

  return {
    title: blog.title || "Default Blog Title",
    description: blog.content
      ? blog.content.substring(0, 150) + "..."
      : "Read the full story here.",
    keywords: blog.tags ? blog.tags.join(", ") : "blog, article, technology",
  };
}

const BlogDetailsPage = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/blogs/${slug}`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

  const result = await res.json();
  const blog: IBlog = result.data;

  return (
    <div className="py-30 max-w-7xl mx-auto justify-center">
      <BlogDetailsCard blog={blog} />
    </div>
  );
};

export default BlogDetailsPage;
