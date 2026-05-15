import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { finalizeCheckout } from "@/lib/checkout";
import Stripe from "stripe";

/**
 * POST /api/checkout/webhook
 * Stripe webhook handler that processes checkout.session.completed events.
 * Verifies the Stripe signature, then delegates to finalizeCheckout()
 * which creates the order, decrements stock, and clears the user's cart.
 * @param req - Raw request body used for Stripe signature verification
 * @returns JSON { received: true } on success, 400 on signature verification failure
 */
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

    await finalizeCheckout(userId, session.id);
  }

  return NextResponse.json({ received: true });
}
