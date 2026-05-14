import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [products, orders, users] = await Promise.all([
    prisma.product.count(),
    prisma.order.findMany({ select: { total: true, status: true } }),
    prisma.user.count(),
  ]);

  const revenue = (orders as { status: string; total: number }[])
    .filter((o) => o.status === "PAID")
    .reduce((s, o) => s + o.total, 0);

  return NextResponse.json({ products, orders: orders.length, revenue, users });
}
