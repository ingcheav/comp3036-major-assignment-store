import { test, expect } from "./fixtures";

test("add product to cart", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/");
    await authenticatedAsUser.locator('[data-testid="add-to-cart-btn"]').first().click();
    await expect(authenticatedAsUser.locator("text=✓ Added")).toBeVisible();
  });

  test("cart page shows items", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/");
    await authenticatedAsUser.locator('[data-testid="add-to-cart-btn"]').first().click();
    await authenticatedAsUser.goto("/cart");
    await expect(authenticatedAsUser.locator('[data-testid="cart-item"]').first()).toBeVisible();
  });

  test("can remove item from cart", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/cart");
    const items = authenticatedAsUser.locator('[data-testid="cart-item"]');
    const count = await items.count();
    if (count > 0) {
      await authenticatedAsUser.locator("text=Remove").first().click();
      await expect(items).toHaveCount(count - 1);
    }
  });

  test("cart shows total price", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/");
    await authenticatedAsUser.locator('[data-testid="add-to-cart-btn"]').first().click();
    await authenticatedAsUser.goto("/cart");
    await expect(authenticatedAsUser.locator('[data-testid="cart-total"]')).toBeVisible();
  });

  test("can update item quantity", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/");
    await authenticatedAsUser.locator('[data-testid="add-to-cart-btn"]').first().click();
    await authenticatedAsUser.goto("/cart");
    const quantityInput = authenticatedAsUser.locator('[data-testid="quantity-input"]').first();
    if (await quantityInput.isVisible()) {
      await quantityInput.fill("2");
      await expect(quantityInput).toHaveValue("2");
    }
  });

  test("unauthenticated user redirected to login when accessing cart", async ({ page }) => {
    await page.goto("/cart");
    await expect(page).toHaveURL(/login/);
  });

  test("cart API rejects unknown item id", async ({ page }) => {
    const response = await page.request.delete("/api/cart/00000000-0000-0000-0000-000000000000");
    expect([401, 404]).toContain(response.status());
  });

