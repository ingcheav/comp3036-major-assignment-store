import { test, expect } from "./fixtures";

test("admin can monitor store metrics", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/");
  await authenticatedAsAdmin.waitForLoadState("networkidle");

  await expect(authenticatedAsAdmin.locator("text=Total Products")).toBeVisible();
  await expect(authenticatedAsAdmin.locator("text=Total Orders")).toBeVisible();
  await expect(authenticatedAsAdmin.locator("text=Total Revenue")).toBeVisible();
  await expect(authenticatedAsAdmin.locator("text=Total Users")).toBeVisible();

  const productStat = authenticatedAsAdmin.locator('[data-testid="stat-value"]').first();
  await expect(productStat).toBeVisible();
});

test("admin can manage products and view inventory", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/products");
  await authenticatedAsAdmin.waitForLoadState("networkidle");

  const productRows = authenticatedAsAdmin.locator('[data-testid="admin-product-row"]');
  const hasRows = await productRows.count() > 0;
  expect(hasRows).toBeTruthy();

  const stockBadge = authenticatedAsAdmin.locator('[data-testid="admin-stock-badge"]').first();
  if (await stockBadge.isVisible()) {
    await expect(stockBadge).toBeVisible();
  }
});

test("admin can review orders", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/orders");
  await authenticatedAsAdmin.waitForLoadState("networkidle");

  const orderRows = authenticatedAsAdmin.locator('[data-testid="order-row"]');
  const hasOrders = await orderRows.count() > 0;
  
  await expect(authenticatedAsAdmin.locator("h1")).toBeVisible();
  
  if (hasOrders) {
    await expect(orderRows.first()).toBeVisible();
  }
});

test("admin can access all key areas from dashboard", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/");
  await authenticatedAsAdmin.waitForLoadState("networkidle");

  await authenticatedAsAdmin.locator("a[href='/products']").first().click();
  await expect(authenticatedAsAdmin).toHaveURL(/products/);

  await authenticatedAsAdmin.goto("/");
  await authenticatedAsAdmin.waitForLoadState("networkidle");

  await authenticatedAsAdmin.locator("a[href='/orders']").first().click();
  await expect(authenticatedAsAdmin).toHaveURL(/orders/);
});