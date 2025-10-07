import BlogDetailsCard from "@/components/modules/blogs/blogDetails";
import { IBlog } from "@/interfaces/blogs.interfaces";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${slug}`);

  if (!res.ok) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be loaded.",
    };
  }

  const data = await res.json();
  const blog:IBlog = data.data

  return {
    title: blog.title || "Default Blog Title",
    description:
      blog.content?.substring(0, 150) + "..." || "Read the full story here.",
    keywords: blog.tags?.join(", ") || "blog, article, technology",
  };
}

const BlogDetailsPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch blog post: HTTP status ${res.status}`);
  }


  const {data} = await res.json();

  return (
    <div className="py-8 max-w-7xl mx-auto justify-center">
      <BlogDetailsCard blog={data} />
    </div>
  );
};

export default BlogDetailsPage;
