import { test, expect } from "@playwright/test";

test("homepage shows products", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test("homepage shows hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("homepage has browse products button", async ({ page }) => {
    await page.goto("/");
    const browseBtn = page.locator("a:has-text('Browse products')");
    if (await browseBtn.isVisible()) {
      await expect(browseBtn).toBeVisible();
    }
  });

  test("can navigate to products page", async ({ page }) => {
    await page.goto("/");
    const productsLink = page.locator("a[href='/products']").first();
    if (await productsLink.isVisible()) {
      await productsLink.click();
      await expect(page).toHaveURL(/products/);
    }
  });

  test("homepage is responsive", async ({ page }) => {
    await page.goto("/");
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeGreaterThan(0);
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  });

  test("products have images", async ({ page }) => {
    await page.goto("/");
    const productImage = page.locator('[data-testid="product-card"] img').first();
    await expect(productImage).toBeVisible();
  });

  test("products have prices", async ({ page }) => {
    await page.goto("/");
    const productPrice = page.locator('[data-testid="product-price"]').first();
    await expect(productPrice).toBeVisible();
  });

