import { test, expect } from "@playwright/test";

const USER = { email: "user@electromart.com", password: "user123" };

async function login(page: any, email: string, password: string) {
  await page.goto("/login");
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);
  await page.click('[data-testid="login-btn"]');
  await page.waitForLoadState("networkidle");
}

test("non-admin is redirected from admin dashboard", async ({ page }) => {
    await login(page, USER.email, USER.password);
    await page.goto("/");
    // Should be redirected since user is not admin
    await expect(page).toHaveURL(/login/);
  });

  test("non-admin cannot access admin products page", async ({ page }) => {
    await login(page, USER.email, USER.password);
    await page.goto("/products");
    // Should not have admin product management interface
    const adminElements = page.locator('[data-testid="admin-product-row"], [data-testid="admin-product-card"]');
    const addProductBtn = page.locator("text=Add Product|New Product");
    
    const hasAdmin = await adminElements.count() > 0;
    const hasAddBtn = await addProductBtn.isVisible();
    
    expect(hasAdmin || hasAddBtn).toBeFalsy();
  });

  test("unauthenticated user cannot access admin", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/login/);
  });

  test("unauthenticated user cannot access admin products", async ({ page }) => {
    await page.goto("/products");
    await expect(page).toHaveURL(/login/);
  });

  test("unauthenticated user cannot access admin orders", async ({ page }) => {
    await page.goto("/orders");
    await expect(page).toHaveURL(/login/);
  });

