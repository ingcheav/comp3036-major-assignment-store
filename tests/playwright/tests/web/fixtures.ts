import { test as base } from "@playwright/test";

const USER = { email: "user@electromart.com", password: "user123" };

export const test = base.extend({
  authenticatedAsUser: async ({ page }, use) => {
    // Login as user
    await page.goto("/login");
    await page.fill('[data-testid="email-input"]', USER.email);
    await page.fill('[data-testid="password-input"]', USER.password);
    await page.click('[data-testid="login-btn"]');
    await page.waitForURL("/");

    // Use the authenticated page
    await use(page);
  },
});

export const expect = base.expect;
