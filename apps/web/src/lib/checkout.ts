import "server-only";

import { prisma } from "@/lib/prisma";

type CheckoutItem = {
  productId: string;
  quantity: number;
  product: { price: number };
};

export async function finalizeCheckout(userId: string, stripeSessionId: string) {
  const existing = await prisma.order.findUnique({
    where: { stripeSessionId },
  });

  if (existing) {
    return existing;
  }

  const cartItems: CheckoutItem[] = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: { select: { price: true } } },
  });

  if (cartItems.length === 0) {
    return null;
  }

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        stripeSessionId,
        total,
        status: "PAID",
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    await Promise.all(
      cartItems.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    await tx.cartItem.deleteMany({ where: { userId } });

    return order;
  });
}