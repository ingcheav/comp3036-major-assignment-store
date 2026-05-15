import { test as setup } from "@playwright/test";

const ADMIN = { email: "admin@electromart.com", password: "admin123" };
const USER = { email: "user@electromart.com", password: "user123" };

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/login");
  await page.fill('[data-testid="email-input"]', ADMIN.email);
  await page.fill('[data-testid="password-input"]', ADMIN.password);
  await page.click('[data-testid="login-btn"]');
  await page.waitForURL("/");

  // Save storage state
  await page.context().storageState({ path: "auth/admin.json" });
});

setup("authenticate as user", async ({ page }) => {
  await page.goto("/login");
  await page.fill('[data-testid="email-input"]', USER.email);
  await page.fill('[data-testid="password-input"]', USER.password);
  await page.click('[data-testid="login-btn"]');
  await page.waitForURL("/");

  // Save storage state
  await page.context().storageState({ path: "auth/user.json" });
});
