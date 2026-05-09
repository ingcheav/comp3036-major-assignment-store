import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPosts } from "@/utils/posts";
import { toUrlPath } from "@repo/utils/url";

// Server page: loads posts and shows only posts with the selected tag.
export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const posts = await getPosts();

  {/* Filter posts by tags name */}
  const filteredPosts = posts.filter((post) =>
    post.tags
      .split(",")
      .some((tag) => toUrlPath(tag) === name)
  );

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
