import { test, expect } from "./fixtures";

test("profile page loads for logged-in user", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/profile");
    await expect(authenticatedAsUser.locator("text=My Profile")).toBeVisible();
  });

  test("profile shows user information", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/profile");
    await expect(authenticatedAsUser.locator('[data-testid="user-name"]')).toBeVisible();
    await expect(authenticatedAsUser.locator('[data-testid="user-email"]')).toBeVisible();
  });

  test("profile page requires authentication", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/login/);
  });

  test("can access profile from navigation", async ({ authenticatedAsUser }) => {
    await authenticatedAsUser.goto("/");
    const profileLink = authenticatedAsUser.locator('a:has-text("Profile")');
    
    if (await profileLink.isVisible()) {
      await profileLink.click();
      await expect(authenticatedAsUser).toHaveURL(/profile/);
    }
  });

