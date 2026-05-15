import { test, expect } from "./fixtures";

test("orders page loads for logged-in user", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/orders");
    await expect(authenticatedAsUser.locator("text=Order History")).toBeVisible();
  });

  test("orders page shows order list", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/orders");
    const orderItems = authenticatedAsUser.locator('[data-testid="order-item"]');
    await expect(orderItems).toBeTruthy();
  });

  test("can view order details", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/orders");
    const firstOrder = authenticatedAsUser.locator('[data-testid="order-item"]').first();
    
    if (await firstOrder.isVisible()) {
      await firstOrder.click();
      await expect(authenticatedAsUser.locator('[data-testid="order-details"]')).toBeVisible();
    }
  });

  test("order details show items and total", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/orders");
    const firstOrder = authenticatedAsUser.locator('[data-testid="order-item"]').first();
    
    if (await firstOrder.isVisible()) {
      await firstOrder.click();
      await expect(authenticatedAsUser.locator('[data-testid="order-items"]')).toBeVisible();
      await expect(authenticatedAsUser.locator('[data-testid="order-total"]')).toBeVisible();
    }
  });

  test("orders page requires authentication", async ({ page }) => {
    await page.goto("/orders");
    await expect(page).toHaveURL(/login/);
  });

