import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPosts } from "@/utils/posts";

// Server page: filters active posts by the year and month from the URL.
export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const {year, month} = await params;
  const posts = await getPosts();

  {/* Filter posts by year and month */}
  const filteredPosts = posts.filter((post) => {
    const postDate = new Date(post.date);
    return (
      String(postDate.getFullYear()) === year &&
      String(postDate.getMonth() + 1) === month
    );
  });

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
