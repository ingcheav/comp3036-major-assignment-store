import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import { getPosts } from "../utils/posts";
import styles from "./page.module.css";

// Server component: fetches active posts for the public homepage.
export default async function Home() {
  const posts = await getPosts();

  return (
    <AppLayout>
      <Main posts={posts} className={styles.main} />
    </AppLayout>
  );
}
