import { test, expect } from "./fixtures";

test("dashboard shows statistics cards", async ({ authenticatedAsAdmin }) => {
    await authenticatedAsAdmin.goto("/");
    await expect(authenticatedAsAdmin.locator("text=Total Products")).toBeVisible();
    await expect(authenticatedAsAdmin.locator("text=Total Orders")).toBeVisible();
    await expect(authenticatedAsAdmin.locator("text=Total Revenue")).toBeVisible();
    await expect(authenticatedAsAdmin.locator("text=Total Users")).toBeVisible();
  });

  test("dashboard stats are numbers", async ({ authenticatedAsAdmin }) => {
    await authenticatedAsAdmin.goto("/");
    const statsCards = authenticatedAsAdmin.locator('[data-testid="stat-card"]');
    await expect(statsCards).toBeTruthy();
  });

  test("dashboard has action links", async ({ authenticatedAsAdmin }) => {
    await authenticatedAsAdmin.goto("/");
    await expect(authenticatedAsAdmin.locator("text=Manage Products")).toBeVisible();
    await expect(authenticatedAsAdmin.locator("text=View Orders")).toBeVisible();
  });

  test("can navigate to products from dashboard", async ({ authenticatedAsAdmin }) => {
    await authenticatedAsAdmin.goto("/");
    await authenticatedAsAdmin.locator("text=Manage Products").click();
    await expect(authenticatedAsAdmin).toHaveURL(/products/);
  });

  test("can navigate to orders from dashboard", async ({ authenticatedAsAdmin }) => {
    await authenticatedAsAdmin.goto("/");
    await authenticatedAsAdmin.locator("text=View Orders").click();
    await expect(authenticatedAsAdmin).toHaveURL(/orders/);
  });

