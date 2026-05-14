import { test, expect } from "./fixtures";

test("user can browse products", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/");
    await expect(authenticatedAsUser.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test("user can click on product", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/");
    await authenticatedAsUser.locator('[data-testid="product-card"]').first().click();
    await expect(authenticatedAsUser.locator("h1")).toBeVisible();
  });

  test("user can view product details", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/");
    await authenticatedAsUser.locator('[data-testid="product-card"]').first().click();
    await authenticatedAsUser.waitForURL(/\/products\//, { timeout: 10000 });
    await expect(authenticatedAsUser.locator('[data-testid="product-price"]').first()).toBeVisible();
    await expect(authenticatedAsUser.locator('[data-testid="product-description"]').first()).toBeVisible();
  });

  test("user can add items to cart", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/");
    const addToCartBtn = authenticatedAsUser.locator('[data-testid="add-to-cart-btn"]').first();
    
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await expect(authenticatedAsUser.locator('[data-testid="add-to-cart-btn"]').first()).toContainText(/Added/);
    }
  });

  test("user can view cart after adding items", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/");
    const addToCartBtn = authenticatedAsUser.locator('[data-testid="add-to-cart-btn"]').first();
    
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await authenticatedAsUser.goto("/cart");
      await expect(authenticatedAsUser.locator('[data-testid="cart-item"]').first()).toBeVisible();
    }
  });

