import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/admin/categories/[id]
 * Updates a category's name by its ID. Requires ADMIN role.
 * @param req - JSON body with name (required, non-empty string)
 * @param params.id - The category's unique identifier
 * @returns The updated Category object
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const category = await prisma.category.update({
    where: { id: params.id },
    data: { name: name.trim() },
  });
  return NextResponse.json(category);
}

/**
 * DELETE /api/admin/categories/[id]
 * Deletes a category by its ID. Requires ADMIN role.
 * Returns HTTP 409 if the category still has products assigned.
 * @param params.id - The category's unique identifier
 * @returns JSON { success: true } on success, 409 if products are still assigned
 */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Cannot delete category — it may still have products assigned" }, { status: 409 });
  }
}
