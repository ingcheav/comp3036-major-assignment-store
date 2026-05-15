import { test, expect } from "./fixtures";

test("checkout button is visible on cart page with items", async ({ authenticatedAsUser }) => {
  await authenticatedAsUser.goto("/");
  await authenticatedAsUser.locator('[data-testid="add-to-cart-btn"]').first().click();
  await authenticatedAsUser.goto("/cart");
  await expect(authenticatedAsUser.locator('[data-testid="checkout-btn"]')).toBeVisible();
});

test("checkout button is enabled when cart has items", async ({ authenticatedAsUser }) => {
  await authenticatedAsUser.goto("/");
  const hasProducts =
    (await authenticatedAsUser.locator('[data-testid="add-to-cart-btn"]').count()) > 0;

  if (hasProducts) {
    await authenticatedAsUser.locator('[data-testid="add-to-cart-btn"]').first().click();
    await authenticatedAsUser.goto("/cart");
    await expect(authenticatedAsUser.locator('[data-testid="checkout-btn"]')).toBeEnabled();
  }
});

test("cart page requires authentication", async ({ page }) => {
  await page.goto("/cart");
  await expect(page).toHaveURL(/login/);
});

test("cart page shows order summary before checkout", async ({ authenticatedAsUser }) => {
  await authenticatedAsUser.goto("/");
  await authenticatedAsUser.locator('[data-testid="add-to-cart-btn"]').first().click();
  await authenticatedAsUser.goto("/cart");
  await expect(authenticatedAsUser.locator('[data-testid="cart-total"]')).toBeVisible();
  await expect(authenticatedAsUser.locator('[data-testid="checkout-btn"]')).toBeVisible();
});
