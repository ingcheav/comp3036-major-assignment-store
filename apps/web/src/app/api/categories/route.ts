import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/categories
 * Returns all product categories sorted alphabetically.
 * Public endpoint — no authentication required.
 * @returns JSON array of Category objects { id, name }
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
