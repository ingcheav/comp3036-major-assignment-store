import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/orders
 * Returns all orders across all users, sorted newest-first.
 * Includes customer information and full order line-item details.
 * Requires ADMIN role.
 * @returns JSON array of Order objects with user { name, email } and orderItems with product details
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: { user: { select: { name: true, email: true } }, orderItems: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
