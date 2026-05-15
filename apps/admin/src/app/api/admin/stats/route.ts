import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/stats
 * Returns aggregated store statistics for the admin dashboard.
 * Requires ADMIN role.
 * @returns JSON object with products count, orders count, total revenue (PAID orders only), and users count
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [products, orders, users] = await Promise.all([
      prisma.product.count(),
      prisma.order.findMany({ select: { total: true, status: true } }),
      prisma.user.count(),
    ]);

    const revenue = orders
      .filter((o) => o.status === "PAID")
      .reduce((s, o) => s + o.total, 0);

    return NextResponse.json({ products, orders: orders.length, revenue, users });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
