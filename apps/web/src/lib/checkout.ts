import "server-only";

import { prisma } from "@/lib/prisma";

type CheckoutItem = {
  productId: string;
  quantity: number;
  product: { price: number };
};

/**
 * Finalizes a Stripe checkout by creating an Order in the database.
 * Idempotent — if an order for the given stripeSessionId already exists, returns it unchanged.
 * Within a single Prisma transaction this function:
 *   1. Creates the Order with PAID status and all OrderItems
 *   2. Decrements stock for each purchased product
 *   3. Clears all CartItems for the user
 * @param userId - The ID of the user who completed checkout
 * @param stripeSessionId - The Stripe Checkout Session ID used for idempotency
 * @returns The created (or pre-existing) Order, or null if the cart was empty
 */
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