import { describe, expect, test } from "vitest";
import { isAdminRole } from "../src/lib/access";

describe("admin access rules", () => {
  test("only ADMIN role is accepted", () => {
    expect(isAdminRole("ADMIN")).toBe(true);
    expect(isAdminRole("USER")).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
  });
});
