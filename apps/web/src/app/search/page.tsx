import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPosts } from "@/utils/posts";

// Server page: reads the search query and filters posts before rendering.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const posts = await getPosts();

  // Filter posts by search
  const filteredPosts = posts.filter ((post) =>
    post.title?.toLowerCase().includes(q?.toLowerCase()) ||
    post.description?.toLowerCase().includes(q?.toLowerCase()) ||
    post.category?.toLowerCase().includes(q?.toLowerCase())
);

  return (
    <AppLayout query={q}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
