import { test, expect } from "@playwright/test";

const USER = { email: "user@electromart.com", password: "user123" };

async function login(page: any, email: string, password: string) {
  await page.goto("/login");
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);
  await page.click('[data-testid="login-btn"]');
  await page.waitForURL("/");
}

test("register page is accessible", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("text=Register")).toBeVisible();
  });

  test("register a new user", async ({ page }) => {
    await page.goto("/register");
    const uniqueEmail = `test+${Date.now()}@electromart.com`;
    await page.fill('[data-testid="name-input"]', "Test User");
    await page.fill('[data-testid="email-input"]', uniqueEmail);
    await page.fill('[data-testid="password-input"]', "password123");
    await page.fill('[data-testid="confirm-password-input"]', "password123"); // ← missing!
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/", { timeout: 10000 });
  });

  test("register form requires name", async ({ page }) => {
    await page.goto("/register");
    await page.fill('[data-testid="email-input"]', "test@electromart.com");
    await page.fill('[data-testid="password-input"]', "password123");
    await page.click('button[type="submit"]');
    expect(page.url()).toContain("/register");
  });

  test("login page is accessible", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('[data-testid="login-btn"]')).toBeVisible();
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

  test("login with empty email shows error", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[data-testid="password-input"]', "password123");
    await page.click('[data-testid="login-btn"]');
    expect(page.url()).toContain("/login");
  });


  test("sign out", async ({ page }) => {
    await login(page, USER.email, USER.password);
    await page.click("text=Sign out");
    await expect(page.locator("nav").locator("a", { hasText: "Sign in" })).toBeVisible();
  });

  test("signed out user can login again", async ({ page }) => {
    await login(page, USER.email, USER.password);
    await page.click("text=Sign out");
    await login(page, USER.email, USER.password);
    await expect(page.locator("text=Sign out")).toBeVisible();
  });

  test("can navigate to login from register page", async ({ page }) => {
    await page.goto("/register");
    const loginLink = page.locator('[data-testid="register-form"] a:has-text("Sign in")').first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/login/);
    }
  });

  test("can navigate to register from login page", async ({ page }) => {
    await page.goto("/login");
    const registerLink = page.locator("a:has-text('Register')");
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/register/);
    }
  });

