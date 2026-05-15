/**
 * Checks whether the given role string is the ADMIN role.
 * Used by middleware and API routes to gate admin-only functionality.
 * @param role - The user's role string, or undefined/null if unauthenticated
 * @returns true only if role is exactly "ADMIN"
 */
export function isAdminRole(role?: string | null) {
  return role === "ADMIN";
}
