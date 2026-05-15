import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * GET /api/products
 * Returns all products with optional filtering, search, and sorting.
 * Public endpoint — no authentication required.
 * @param req - Accepts query params: search, category, sortBy, minPrice, maxPrice
 * @returns JSON array of Product objects including their Category relation
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "newest";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
    switch (sortBy) {
      case "name_asc": return { name: "asc" as const };
      case "name_desc": return { name: "desc" as const };
      case "price_asc": return { price: "asc" as const };
      case "price_desc": return { price: "desc" as const };
      case "oldest": return { createdAt: "asc" as const };
      default: return { createdAt: "desc" as const };
    }
  })();

  const where: Prisma.ProductWhereInput = {
    ...(search && { name: { contains: search, mode: "insensitive" } }),
    ...(category && { category: { name: category } }),
    ...((minPrice || maxPrice) && {
      price: {
        ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
        ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
      },
    }),
  };

  try {
    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/products
 * Creates a new product. Requires ADMIN role.
 * @param req - JSON body with name, description, price, stock, imageUrl, categoryId
 * @returns The created Product object with its Category, HTTP 201 on success
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, description, price, stock, imageUrl, categoryId } = await req.json();
  if (!name || !price || !categoryId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: { name, description, price: parseFloat(price), stock: parseInt(stock) || 0, imageUrl, categoryId },
    include: { category: true },
  });

  return NextResponse.json(product, { status: 201 });
}
