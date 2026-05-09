import type { Post } from "@repo/db/data";
import Link from "next/link";

export function BlogList({ posts }: { posts: Post[] }) {
  // {/* "1. renders 0 post when no posts are present (display "0 Posts")" */}
  if (posts.length === 0) {
    return <p className="text-gray-900 dark:text-white">0 Posts</p>;
  }

  // 2. {/* renders all posts (if there are posts, display them) */}
  return (
    <div className="space-y-6">                                                                             {/*2. add spacing between posts*/}
      {posts.map((post) => (
          <article
          key={post.id}
          data-test-id={`blog-post-${post.id}`}
          data-testid={`blog-post-${post.id}`}
          className="border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800"
          >                                                                                                   {/*2. Use <article> to check the tag*/} 

          <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-52 h-36 object-cover rounded" 
          />                                                                                                   {/*2. render the image with proper styling*/}

          <div className="flex flex-col justify-between w-full dark:text-gray-300">
            {post.date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>

          <Link href={`/post/${post.urlId}`} className="text-xl font-bold dark:text-white block">
            {post.title}
          </Link>

          <p className="text-gray-600 dark:text-gray-300">
            {post.description}
          </p>

          <p className="text-sm dark:text-gray-300">
            {post.category}
          </p>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {post.tags
            ?.split(",")
            .map((tag) => `#${tag.trim()}`)
            .join(" ")}
          </div>
          
          <div className="flex gap-5 text-sm mt-3 dark:text-gray-300">
            <p>👀 {post.views} views</p>
            <p>👍🏻 {post.likes} likes</p>
          </div>
            
          </article>
      ))}
    </div>
  );
}

export default BlogList;
