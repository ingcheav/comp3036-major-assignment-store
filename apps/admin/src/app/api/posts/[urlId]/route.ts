import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ urlId: string }>;
};

// Creates a new blog post from the admin form data.
export async function POST(request: Request, _context: RouteContext) {
  const body = await request.json();
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "file:../../../packages/db/prisma/dev.db",
      },
    },
  });

  try {
    // Prisma writes the new post record into the SQLite database.
    await prisma.post.create({
      data: {
        title: body.title,
        urlId: createUrlId(body.title),
        category: body.category,
        description: body.description,
        content: body.content,
        imageUrl: body.imageUrl,
        tags: body.tags,
        active: true,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

// Updates the editable fields for an existing post matched by its urlId.
export async function PUT(request: Request, { params }: RouteContext) {
  const { urlId } = await params;
  const body = await request.json();
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "file:../../../packages/db/prisma/dev.db",
      },
    },
  });

  // Prisma updates only the fields sent from the edit form.
  await prisma.post.update({
    where: { urlId },
    data: {
      title: body.title,
      description: body.description,
      content: body.content,
      imageUrl: body.imageUrl,
      tags: body.tags,
    },
  });

  return NextResponse.json({ success: true });
}

// Updates the active flag when the admin toggles post visibility.
export async function PATCH(request: Request, { params }: RouteContext) {
  const { urlId } = await params;
  const body = await request.json();
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "file:../../../packages/db/prisma/dev.db",
      },
    },
  });

  // Only the active status changes here; the rest of the post stays the same.
  await prisma.post.update({
    where: { urlId },
    data: { active: body.active },
  });

  return NextResponse.json({ success: true });
}

// Converts a title into a URL-friendly id such as "my-first-post".
function createUrlId(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
