import { BlogDetail } from "@/components/Blog/Detail";
import { AppLayout } from "@/components/Layout/AppLayout";
import { PrismaClient } from "@prisma/client";
import type { Post } from "@repo/db/data";
import { marked } from "marked";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:../../../packages/db/prisma/dev.db",
    },
  },
});

// Server page: loads one post, increments its views, and renders the detail page.
export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  try {
    // Each visit increases the view count in the database by one.
    await prisma.post.update({
      where: { urlId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  } catch {
    // Missing posts are handled by the follow-up findUnique call.
  }

  // Fetch the full post after updating views, including Likes for the count.
  const postRecord = await prisma.post.findUnique({
    where: { urlId },
    include: { Likes: true },
  });

  const post: Post | null = postRecord
    ? {
        ...postRecord,
        likes: postRecord.Likes.length,
      }
    : null;

  if (!post) {
    return <AppLayout>Article not found</AppLayout>;
  }

  // Convert Markdown content into HTML before passing it to the client component.
  const contentHtml = await marked.parse(post.content);
  const dateLabel = post.date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <AppLayout>
      <BlogDetail
        contentHtml={contentHtml}
        dateLabel={dateLabel}
        post={{
          id: post.id,
          urlId: post.urlId,
          title: post.title,
          imageUrl: post.imageUrl,
          category: post.category,
          tags: post.tags,
          views: post.views,
          likes: post.likes,
        }}
      />
    </AppLayout>
  );
}
