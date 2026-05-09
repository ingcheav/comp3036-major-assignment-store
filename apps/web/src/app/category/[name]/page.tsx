import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPosts } from "@/utils/posts";
import { toUrlPath } from "@repo/utils/url";

// Server page: loads posts and shows only the active posts in this category.
export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const posts = await getPosts();

  {/* Filter posts by category name */}
  const filteredPosts = posts.filter(
    (post) => toUrlPath(post.category) === name && post.active
  );

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
