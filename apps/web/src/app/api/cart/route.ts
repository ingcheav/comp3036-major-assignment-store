import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/cart
 * Returns all cart items for the currently authenticated user.
 * @returns JSON { items: CartItem[] } where each item includes product and category details
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: { include: { category: true } } },
    });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/cart
 * Adds a product to the cart. If the product is already in the cart, increments quantity.
 * @param req - JSON body with productId and optional quantity (defaults to 1)
 * @returns The CartItem (updated or newly created) including the product details
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity = 1 } = await req.json();

  try {
    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: session.user.id, productId } },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      });
      return NextResponse.json(updated);
    }

    const item = await prisma.cartItem.create({
      data: { userId: session.user.id, productId, quantity },
      include: { product: true },
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/cart
 * Clears all cart items for the currently authenticated user.
 * @returns JSON { success: true } on successful deletion
 */
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
