import { getAllBlogs } from "@/actions/getBlogs";
import BlogCard from "@/components/modules/blogs/blogCard";
import { IBlog } from "@/interfaces/blogs.interfaces";

// Make sure this is a default export
const AllBlogsPage = async () => {
  try {
    const blogs = await getAllBlogs();
    console.log(blogs);

    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
          All Blogs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {blogs?.length > 0 ? (
            blogs?.map((post: IBlog) => <BlogCard key={post.id} post={post} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg sm:text-xl text-gray-600">
                No blogs found.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return (
      <div className="py-30 px-4 max-w-7xl mx-auto">
        <h2 className="text-center text-4xl">All Blogs</h2>
        <div className="text-center text-red-500 py-8">
          <p>Error loading blogs. Please try again later.</p>
          <p className="text-sm mt-2">Error: {(error as Error).message}</p>
        </div>
      </div>
    );
  }
};

// Make sure this is a default export
export default AllBlogsPage;
