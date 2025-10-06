import BlogCard from "@/components/modules/blogs/blogCard";
import { IBlog } from "@/interfaces/blogs.interfaces";

const AllBlogsPage = async () => {
  console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/all`);

  // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/all`, {
  //   cache: "no-store",
  // });
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/all`, {
    cache: "no-store",
  });
  console.log(res);

  const { data: blogs }: { data: IBlog[] } = await res.json();

  return (
    <div className="py-30 px-4 max-w-7xl mx-auto">
      <h2 className="text-center text-4xl">All Blogs</h2>
      <div className="grid grid-cols-3 max-w-6xl justify-center gap-5 my-5">
        {blogs.map((post: IBlog) => {
          return <BlogCard key={post.id} post={post} />;
        })}
      </div>
    </div>
  );
};

export default AllBlogsPage;
