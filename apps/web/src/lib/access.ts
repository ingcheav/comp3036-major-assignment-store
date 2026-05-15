/**
 * Determines whether a user with the given role is allowed to use the customer storefront.
 * Admin users are excluded from the storefront to prevent them from placing orders.
 * @param role - The user's role string, or undefined/null if unauthenticated
 * @returns true if the user can shop (i.e. is not an ADMIN)
 */
export function canShopAsUser(role?: string | null) {
  return role !== "ADMIN";
}
