"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BlogDetailProps = {
  post: {
    id: number;
    urlId: string;
    title: string;
    imageUrl: string;
    category: string;
    tags: string;
    views: number;
    likes: number;
  };
  dateLabel: string;
  contentHtml: string;
};

// Keeps each post's liked state separate in localStorage.
function getLikedStorageKey(urlId: string) {
  return `blog-post:${urlId}:liked`;
}

// Client component: displays one post and handles the like button interaction.
export function BlogDetail({ post, dateLabel, contentHtml }: BlogDetailProps) {
  const [views, setViews] = useState(post.views);
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);

  // Sync server values into client state when a new post is loaded.
  useEffect(() => {
    setViews(post.views);
    setLikes(post.likes);

    const storedLiked =
      window.localStorage.getItem(getLikedStorageKey(post.urlId)) === "true";
    setLiked(storedLiked);
  }, [post.likes, post.urlId, post.views]);

  const tags = post.tags
    .split(",")
    .map((tag) => `#${tag.trim()}`)
    .join(" ");

  // Optimistically updates the UI, then sends the like/unlike request to the API.
  const toggleLike = () => {
    const nextLiked = !liked;
    window.localStorage.setItem(getLikedStorageKey(post.urlId), `${nextLiked}`);
    setLiked(nextLiked);
    setLikes((currentLikes) => currentLikes + (nextLiked ? 1 : -1));

    void fetch("/api/likes", {
      method: nextLiked ? "POST" : "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId: post.id }),
    }).catch(() => {
      // Keep the optimistic UI stable if the network request fails.
    });
  };

  return (
    <article
      className="mx-auto flex max-w-3xl flex-col gap-4 p-6"
      data-test-id={`blog-post-${post.id}`}
      data-testid={`blog-post-${post.id}`}
    >
      <img
        src={post.imageUrl}
        alt={post.title}
        className="h-auto w-full rounded object-cover aspect-[13/9]"
      />

      <Link
        className="text-4xl font-bold text-gray-900 underline-offset-4 hover:underline dark:text-white"
        href={`/post/${post.urlId}`}
      >
        {post.title}
      </Link>

      <p className="text-sm text-gray-600 dark:text-gray-300">{post.category}</p>

      <p className="text-sm text-gray-600 dark:text-gray-300">{tags}</p>

      <p className="text-sm text-gray-600 dark:text-gray-300">{dateLabel}</p>

      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
        <p>{views} views</p>
        <p>{likes} likes</p>
        <button
          className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
          data-test-id="like-button"
          data-testid="like-button"
          onClick={toggleLike}
          type="button"
        >
          {liked ? "Unlike" : "Like"}
        </button>
      </div>

      {/* HTML is generated from Markdown on the server page. */}
      <div
        className="prose max-w-none text-gray-900 dark:prose-invert dark:text-white"
        data-test-id="content-markdown"
        data-testid="content-markdown"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
}
