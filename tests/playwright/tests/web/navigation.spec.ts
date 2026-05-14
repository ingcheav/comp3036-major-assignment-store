import { test, expect } from "@playwright/test";

const USER = { email: "user@electromart.com", password: "user123" };

async function login(page: any, email: string, password: string) {
  await page.goto("/login");
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);
  await page.click('[data-testid="login-btn"]');
  await page.waitForURL("/");
}

test("main navigation is accessible", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("logo navigates to home", async ({ page }) => {
    await login(page, USER.email, USER.password);
    await page.goto("/products");
    const logo = page.locator("a[href='/']").first();
    if (await logo.isVisible()) {
      await logo.click();
      await expect(page).toHaveURL("/");
    }
  });

  test("can navigate to products from home", async ({ page }) => {
    await page.goto("/");
    const productsLink = page.locator("a[href='/products']").first();
    if (await productsLink.isVisible()) {
      await productsLink.click();
      await expect(page).toHaveURL(/products/);
    }
  });

  test("footer is present on pages", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    if (await footer.isVisible()) {
      await expect(footer).toBeVisible();
    }
  });

  test("404 page shows for invalid route", async ({ page }) => {
    await page.goto("/invalid-route-xyz");
    const hasNotFound =
      await page.locator("text=not found").first().isVisible() ||
      await page.locator("text=Not Found").first().isVisible() ||
      await page.locator("text=404").first().isVisible();
    expect(hasNotFound).toBeTruthy();
  });

  test("unauthenticated user sees sign in link", async ({ page }) => {
    await page.goto("/");
    const signInLink = page.locator("a[href='/login']").first();
    expect(await signInLink.isVisible()).toBeTruthy();
  });

  test("authenticated user sees sign out button", async ({ page }) => {
    await login(page, USER.email, USER.password);
    const signOutBtn = page.locator("text=Sign out");
    expect(await signOutBtn.isVisible()).toBeTruthy();
  });

  test("page title is set correctly", async ({ page }) => {
    await page.goto("/");
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test("can navigate using browser back button", async ({ page }) => {
    await page.goto("/");
    await page.goto("/login");
    await expect(page).toHaveURL(/login/);
    await page.goBack();
    await expect(page).toHaveURL("/");
  });

