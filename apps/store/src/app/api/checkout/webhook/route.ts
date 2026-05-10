// src/app/api/checkout/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (!userId) return NextResponse.json({ ok: true });

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    const total = cartItems.reduce((sum: number, i) => sum + i.product.price * i.quantity, 0);

    await prisma.order.create({
      data: {
        userId,
        total,
        status: "PAID",
        orderItems: {
          create: cartItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.product.price,
          })),
        },
      },
    });

    await prisma.cartItem.deleteMany({ where: { userId } });

    await Promise.all(
      cartItems.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );
  }

  return NextResponse.json({ ok: true });
}
