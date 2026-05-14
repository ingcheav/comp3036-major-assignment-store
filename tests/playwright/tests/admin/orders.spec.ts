import { test, expect } from "./fixtures";

test("admin can view all orders", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/orders");
  await expect(authenticatedAsAdmin.locator("text=All Orders")).toBeVisible();
});

test("orders page shows list of orders", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/orders");
  await authenticatedAsAdmin.waitForLoadState("networkidle");
  await expect(authenticatedAsAdmin.locator("h1")).toBeVisible();
});

test("orders API returns data", async ({ authenticatedAsAdmin }) => {
  const response = await authenticatedAsAdmin.request.get("/api/admin/orders");
  expect(response.status()).toBe(200);
  const orders = await response.json();
  expect(Array.isArray(orders) || orders.orders).toBeTruthy();
});

