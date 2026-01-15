import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getBlog } from "../utils/api";
import { MdArrowBack, MdCalendarToday, MdCategory } from "react-icons/md";

const BlogPost = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();

  const { data: blog, isLoading, isError } = useQuery(
    ["blog", blogId],
    () => getBlog(blogId),
    {
      enabled: !!blogId,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flexCenter bg-gray-50 pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen flexCenter bg-gray-50 pt-24">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">404</div>
          <h2 className="text-2xl font-bold mb-2">Blog post not found</h2>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-padd-container">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-secondary mb-6 transition-colors"
        >
          <MdArrowBack size={20} />
          <span>Back</span>
        </button>

        {/* Blog Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Featured Image */}
          {blog.image && (
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block bg-secondary text-white px-4 py-1 rounded-full text-sm mb-3">
                  {blog.category}
                </span>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white">
                  {blog.title}
                </h1>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-10 lg:p-12">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-500">
                <MdCalendarToday size={18} />
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <MdCategory size={18} />
                <span>{blog.category}</span>
              </div>
            </div>

            {/* Summary */}
            {blog.summary && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <p className="text-lg text-gray-700 italic">{blog.summary}</p>
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }}
              />
            </div>
          </div>
        </div>

        {/* Back to Blogs */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-secondary/90 transition-colors font-medium"
          >
            View More Blogs
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
