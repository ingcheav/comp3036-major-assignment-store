import { PrismaClient } from "@prisma/client";
import type { Post } from "@repo/db/data";
import { ListScreen } from "../components/ListScreen";
import { LoginScreen } from "../components/LoginScreen";
import { LogoutButton } from "../components/LogoutButton";
import { isLoggedIn } from "../utils/auth";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:../../../packages/db/prisma/dev.db",
    },
  },
});

// Server component for the admin dashboard.
export default async function Home() {
  // use the is logged in function to check if user is authorised
  // we will use the cookie based approach

  // check if user is authenticated using cookie
  const loggedIn = await isLoggedIn();

  // shows login screen - if not logged in
  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-gray-100 p-5">
        <LoginScreen />
      </main>
    );
    
  } else {
    // Fetch all posts for admin view, including Likes so the like count can be shown.
    const posts = (await prisma.post.findMany({
      include: { Likes: true },
      orderBy: { id: "asc" },
    })).map((post): Post => ({
      ...post,
      likes: post.Likes.length,
    }));

    // show admin home screen to authorised user - if logged in
    return (
      <main className="min-h-screen bg-gray-100 p-5">
        <div className="max-w-5xl mx-auto space-y-6 text-gray-800">
        <header className="bg-white rounded-xl shadow-sm p-5 flex flex-wrap items-center justify-between gap-4 border border-gray-200">
          <h1 className="text-3xl font-semibold text-gray-800">Admin of Full Stack Blog</h1>
          <LogoutButton />
        </header>

        {/* show all posts - render list of posts when logged in */}        
        <ListScreen posts={posts} />
        </div>
        
      </main>
    );
  }
}
