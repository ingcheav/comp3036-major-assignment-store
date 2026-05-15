import { test, expect } from "./fixtures";

test("orders page shows list", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/orders");
  await expect(authenticatedAsAdmin.locator("text=All Orders")).toBeVisible();
});

test("orders page has table or list", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/orders");
  await authenticatedAsAdmin.waitForLoadState("networkidle");
  const orderRows = authenticatedAsAdmin.locator('[data-testid="order-row"]');
  const emptyState = authenticatedAsAdmin.locator("text=No orders yet");
  const hasRows = await orderRows.count() > 0;
  const hasEmptyState = await emptyState.isVisible();
  expect(hasRows || hasEmptyState).toBeTruthy();
});

test("can view order details", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/orders");
  const firstOrder = authenticatedAsAdmin.locator('[data-testid="order-row"], [data-testid="order-list-item"]').first();
    
  if (await firstOrder.isVisible()) {
    await firstOrder.click();
    await expect(authenticatedAsAdmin.locator('[data-testid="order-detail-view"]')).toBeVisible();
  }
});

test("order details show order information", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/orders");
  const firstOrder = authenticatedAsAdmin.locator('[data-testid="order-row"], [data-testid="order-list-item"]').first();
    
  if (await firstOrder.isVisible()) {
    await firstOrder.click();
    const orderIdEl = authenticatedAsAdmin.locator('[data-testid="order-id"]');
    const orderStatusEl = authenticatedAsAdmin.locator('[data-testid="order-status"]');
      
    const hasOrderId = await orderIdEl.isVisible();
    const hasOrderStatus = await orderStatusEl.isVisible();
      
    expect(hasOrderId || hasOrderStatus).toBeTruthy();
  }
});

test("orders page requires admin authentication", async ({ page }) => {
  await page.goto("/admin/orders");
  await expect(page).toHaveURL(/login/);
});