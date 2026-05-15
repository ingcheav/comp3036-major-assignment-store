import { test, expect } from "@playwright/test";

test("category filter works", async ({ page }) => {
    await page.goto("/");
    await page.selectOption('[data-testid="category-filter"]', "Audio");
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test("search filters products", async ({ page }) => {
    await page.goto("/");
    await page.fill('[data-testid="search-input"]', "MacBook");
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test("product detail page loads", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-testid="product-card"]').first().click();
    await page.waitForURL(/\/products\//, { timeout: 10000 });
    await expect(page.locator("h1")).toBeVisible();
    const addToCart = page.locator('[data-testid="add-to-cart-btn"]').first();
    const outOfStock = page.locator("text=Out of stock").first();
    const hasAction = await addToCart.isVisible() || await outOfStock.isVisible();
    expect(hasAction).toBeTruthy();
  });

  test("product detail shows price and description", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-testid="product-card"]').first().click();
    await page.waitForURL(/\/products\//, { timeout: 10000 });
    await expect(page.locator('[data-testid="product-price"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="product-description"]').first()).toBeVisible();
  });

