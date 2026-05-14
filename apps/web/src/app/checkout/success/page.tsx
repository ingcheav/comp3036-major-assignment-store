import Link from "next/link";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { finalizeCheckout } from "@/lib/checkout";
import { CartReset } from "@/components/CartReset";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) redirect("/");

  const stripeSession = await stripe.checkout.sessions.retrieve(session_id);

  if (stripeSession.payment_status === "paid") {
    const userId = stripeSession.metadata?.userId;

    if (userId) {
      await finalizeCheckout(userId, stripeSession.id);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="card p-12 text-center max-w-lg w-full">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#03254c] mb-3">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 text-base leading-relaxed mb-2">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          A confirmation will be sent to your inbox shortly.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
          <p className="text-sm text-[#1167b1]">
            Your order is being prepared and will ship soon.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/orders" className="btn-secondary py-2.5 px-6">
            View Orders
          </Link>
          <Link href="/" className="btn-primary py-2.5 px-6">
            Continue Shopping
          </Link>
        </div>

        <CartReset />
      </div>
    </div>
  );
}
