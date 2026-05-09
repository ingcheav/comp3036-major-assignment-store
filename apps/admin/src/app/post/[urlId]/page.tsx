import { LoginScreen } from "../../../components/LoginScreen";
import { UpdateScreen } from "../../../components/UpdateScreen";
import { isLoggedIn } from "../../../utils/auth";
import { PrismaClient } from "@prisma/client";
import type { Post } from "@repo/db/data";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:../../../packages/db/prisma/dev.db",
    },
  },
});

// main page component for updating a post
// Server component: checks auth, loads one post, then passes it to the edit form.
export default async function PostPage({
  params,
}: {
  params: Promise<{ urlId: string }>;       // URL param (postId)
}) {
  const { urlId } = await params;           // get urlId from params
  
  // check if user is authenticated using cookie
  const loggedIn = await isLoggedIn();

  // if not logged in - show login screen
  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-gray-100 p-5">
        <LoginScreen />
      </main>
    );
  }

  // fetch post from database using urlId
  const postRecord = await prisma.post.findUnique({
    where: { urlId },
    include: { Likes: true },
  });

  const post: Post | null = postRecord
    ? {
        ...postRecord,
        // Convert related Like rows into a simple number for the UI.
        likes: postRecord.Likes.length,
      }
    : null;

  // show post not found if no post matches the urlId
  if (!post) {
    return (
      <main className="min-h-screen bg-gray-100 p-5">
        <div className="max-w-5xl mx-auto space-y-6 text-gray-800">
          Post not found
        </div>
      </main>
    );
  }

  // if user is authenticated and post is found - show update form
  return (
    <main className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-5xl mx-auto space-y-6 text-gray-800">
        <UpdateScreen post={post} />
      </div>
    </main>
  );
}
