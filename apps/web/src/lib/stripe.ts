import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Returns a singleton Stripe client instance.
 * Lazily initialises the client on first call using STRIPE_SECRET_KEY from the environment.
 * Throws if the key is not set, preventing silent failures.
 * @returns Configured Stripe client ready for API calls
 * @throws Error if STRIPE_SECRET_KEY environment variable is not set
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
  }
  return _stripe;
}
