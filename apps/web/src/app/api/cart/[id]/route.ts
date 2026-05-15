import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/cart/[id]
 * Updates the quantity of a specific cart item.
 * Validates that the item belongs to the authenticated user.
 * @param req - JSON body with quantity (must be >= 1)
 * @param params.id - The cart item's unique identifier
 * @returns The updated CartItem including product details
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quantity } = await req.json();
  if (quantity < 1) return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });

  const existing = await prisma.cartItem.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const item = await prisma.cartItem.update({
    where: { id: existing.id },
    data: { quantity },
    include: { product: true },
  });

  return NextResponse.json(item);
}

/**
 * DELETE /api/cart/[id]
 * Removes a specific cart item.
 * Validates that the item belongs to the authenticated user before deletion.
 * @param params.id - The cart item's unique identifier
 * @returns JSON { success: true } on successful deletion
 */
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.cartItem.findFirst({
    where: { id: params.id, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.cartItem.delete({ where: { id: existing.id } });
  return NextResponse.json({ success: true });
}
