// tests/playwright/shop.spec.ts
import { test, expect } from "@playwright/test";

const USER = { email: "user@electromart.com", password: "user123" };
const ADMIN = { email: "admin@electromart.com", password: "admin123" };

// Helper to login
async function login(page: any, email: string, password: string) {
  await page.goto("/login");
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);
  await page.click('[data-testid="login-btn"]');
  await page.waitForURL("/");
}

// --- Auth ---
test.describe("Authentication", () => {
  test("register a new user", async ({ page }) => {
    await page.goto("/register");
    await page.fill('[data-testid="name-input"]', "Test Playwright");
    await page.fill('[data-testid="email-input"]', `test_${Date.now()}@example.com`);
    await page.fill('[data-testid="password-input"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/");
  });

  test("login with valid credentials", async ({ page }) => {
    await login(page, USER.email, USER.password);
    await expect(page.locator("text=Sign out")).toBeVisible();
  });

  test("login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[data-testid="email-input"]', "wrong@example.com");
    await page.fill('[data-testid="password-input"]', "wrongpass");
    await page.click('[data-testid="login-btn"]');
    await expect(page.locator("text=Invalid email or password")).toBeVisible();
  });

  test("sign out", async ({ page }) => {
    await login(page, USER.email, USER.password);
    await page.click("text=Sign out");
    await expect(page.locator("text=Sign in")).toBeVisible();
  });
});

// --- Product Listing ---
test.describe("Product listing", () => {
  test("homepage shows products", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test("search filters products", async ({ page }) => {
    await page.goto("/");
    await page.fill('[data-testid="search-input"]', "MacBook");
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 5000 });
  });

  test("category filter works", async ({ page }) => {
    await page.goto("/");
    await page.selectOption('[data-testid="category-filter"]', "Audio");
    const cards = page.locator('[data-testid="product-card"]');
    await expect(cards).toHaveCount(3, { timeout: 5000 });
  });

  test("product detail page loads", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-testid="product-card"]').first().click();
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=Add to cart")).toBeVisible();
  });
});

// --- Cart ---
test.describe("Shopping cart", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, USER.email, USER.password);
  });

  test("add product to cart", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-testid="add-to-cart-btn"]').first().click();
    await expect(page.locator("text=✓ Added")).toBeVisible();
  });

  test("cart page shows items", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-testid="add-to-cart-btn"]').first().click();
    await page.goto("/cart");
    await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible();
  });

  test("can remove item from cart", async ({ page }) => {
    await page.goto("/cart");
    const items = page.locator('[data-testid="cart-item"]');
    const count = await items.count();
    if (count > 0) {
      await page.locator("text=Remove").first().click();
      await expect(items).toHaveCount(count - 1);
    }
  });

  test("redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/login");
    await page.click("text=Sign out").catch(() => {});
    await page.goto("/cart");
    await expect(page).toHaveURL(/login/);
  });
});

// --- Admin ---
test.describe("Admin", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN.email, ADMIN.password);
  });

  test("admin can access dashboard", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator("text=Admin Dashboard")).toBeVisible();
  });

  test("admin can see product table", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.locator('[data-testid="admin-product-row"]').first()).toBeVisible({ timeout: 10000 });
  });

  test("admin can view all orders", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page.locator("text=All Orders")).toBeVisible();
  });

  test("non-admin is redirected from admin", async ({ page }) => {
    await login(page, USER.email, USER.password);
    await page.goto("/admin");
    await expect(page).not.toHaveURL("/admin");
  });
});

// --- Purchase History ---
test.describe("Order history", () => {
  test("orders page loads for logged-in user", async ({ page }) => {
    await login(page, USER.email, USER.password);
    await page.goto("/orders");
    await expect(page.locator("text=Order History")).toBeVisible();
  });
});
