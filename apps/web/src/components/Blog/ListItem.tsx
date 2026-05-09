import type { Post } from "@repo/db/data";
import Link from "next/link";

export function BlogListItem({ post }: { post: Post }) {
  return (
    <article
      key={post.id}
      className="flex flex-row gap-8"
      data-test-id={`blog-post-${post.id}`}
    >
      {/* 3. render blog post data */}
      <Link href={`/post/${post.urlId}`}>              {/* 3. create clickable link to the blog post using its unique URL ID */} 
        {post.title}
      </Link>

      <p>{post.category}</p>

      <p>
        {post.tags
          .split(",")
          .map(tag => `#${tag.trim()}`)
          .join(" ")
        }
      </p>

      <p>{post.date.toLocaleDateString("en-GB", { 
        day: "2-digit",
        month: "short",
        year: "numeric",
       })}
      </p>

      <p>{post.views} views</p>
      <p>{post.likes} likes</p>
    </article>
  );
}
export default BlogListItem;
