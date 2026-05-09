import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:../../../packages/db/prisma/dev.db",
    },
  },
});

// Adds a like for the current visitor based on their IP address.
export async function POST(request: Request) {
  const { postId } = await request.json();
  // The IP is used with postId so one visitor can only like a post once.
  const ip = (await headers()).get("x-forwarded-for") || "unknown";

  try {
    // Prisma creates a Like row linked to this post.
    await prisma.like.create({
      data: {
        postId,
        userIP: ip,
      },
    });
  } catch {
    // Ignore duplicate likes.
  }

  return Response.json({ success: true });
}

// Removes the visitor's like for a post.
export async function DELETE(request: Request) {
  const { postId } = await request.json();
  // Use the same IP lookup as POST so the matching like can be removed.
  const ip = (await headers()).get("x-forwarded-for") || "unknown";

  try {
    await prisma.like.delete({
      where: {
        postId_userIP: {
          postId,
          userIP: ip,
        },
      },
    });
  } catch {
    // Ignore missing likes.
  }

  return Response.json({ success: true });
}
