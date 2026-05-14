export function canShopAsUser(role?: string | null) {
  return role !== "ADMIN";
}
