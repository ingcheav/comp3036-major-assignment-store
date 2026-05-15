import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/categories (admin app)
 * Returns all product categories sorted alphabetically.
 * Used to populate category dropdowns in admin product forms.
 * Requires a valid admin session.
 * @returns JSON array of Category objects { id, name }
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/categories (admin app)
 * Creates a new product category. Requires ADMIN role.
 * @param req - JSON body with name (required, non-empty string)
 * @returns The newly created Category object
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const category = await prisma.category.create({ data: { name: name.trim() } });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
