import type { Post } from "@repo/db/data";
import BlogList from "./Blog/List";

export function Main({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  const activePosts = posts.filter((post) => post.active);

  return (
    <main className={className}>

      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-950 dark:text-white">From the Blog</h1>
        <p className="text-gray-600 dark:text-gray-300">Learn how to grow your business with our expert advice.</p>
      </div>

      {/* Blog Post */}
      <BlogList posts={activePosts} />
    </main>
  );
}
