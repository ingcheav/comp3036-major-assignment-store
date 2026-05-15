import { describe, expect, test } from "vitest";
import { canShopAsUser } from "../src/lib/access";

describe("web access rules", () => {
  test("admin users should not shop from the storefront", () => {
    expect(canShopAsUser("ADMIN")).toBe(false);
  });

  test("normal users can shop", () => {
    expect(canShopAsUser("USER")).toBe(true);
    expect(canShopAsUser(undefined)).toBe(true);
  });
});
