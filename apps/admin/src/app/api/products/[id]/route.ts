import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/products/[id] (admin app)
 * Updates a product by its ID. Requires ADMIN role.
 * @param req - JSON body with fields: name, description, price, stock, imageUrl, categoryId
 * @param params.id - The product's unique identifier
 * @returns The updated Product object including its Category relation
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/products/[id] (admin app)
 * Deletes a product by its ID. Requires ADMIN role.
 * @param params.id - The product's unique identifier
 * @returns JSON { success: true } on successful deletion
 */
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
