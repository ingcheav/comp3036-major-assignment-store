// src/app/api/cart/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT /api/cart/:id — update quantity
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quantity } = await req.json();
  if (quantity < 1) return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });

  const item = await prisma.cartItem.update({
    where: { id: params.id },
    data: { quantity },
    include: { product: true },
  });

  return NextResponse.json(item);
}

// DELETE /api/cart/:id — remove single item
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.cartItem.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
