import { test as base } from "@playwright/test";

const ADMIN = { email: "admin@electromart.com", password: "admin123" };

export const test = base.extend({
  authenticatedAsAdmin: async ({ page }, use) => {
    // Login as admin
    await page.goto("/login");
    await page.fill('[data-testid="email-input"]', ADMIN.email);
    await page.fill('[data-testid="password-input"]', ADMIN.password);
    await page.click('[data-testid="login-btn"]');
    await page.waitForURL("/");

    // Use the authenticated page
    await use(page);
  },
});

export const expect = base.expect;
