import { PrismaClient } from "@prisma/client";
import type { Post } from "@repo/db/data";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:../../../packages/db/prisma/dev.db",
    },
  },
});

// Converts a Prisma post record into the shared Post shape used by components.
function toPost(post: Awaited<ReturnType<typeof prisma.post.findMany>>[number] & { Likes: unknown[] }): Post {
  return {
    ...post,
    likes: post.Likes.length,
  };
}

// Fetches active posts for the public site, including Like rows for counts.
export async function getPosts(): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { active: true },
    include: { Likes: true },
    orderBy: { id: "asc" },
  });

  return posts.map(toPost);
}
