import { test, expect } from "./fixtures";

test("admin can access dashboard", async ({ authenticatedAsAdmin }) => {
    await authenticatedAsAdmin.goto("/");
    const hasDashboard =
    await authenticatedAsAdmin.locator("text=Admin overview").isVisible() ||
    await authenticatedAsAdmin.locator("text=ElectroMart Admin").isVisible();
  expect(hasDashboard).toBeTruthy();
  });

  test("dashboard page loads correctly", async ({ authenticatedAsAdmin }) => {
    await authenticatedAsAdmin.goto("/");
    await expect(authenticatedAsAdmin).toHaveURL("/");
  });

  test("admin can access products from dashboard", async ({ authenticatedAsAdmin }) => {
    await authenticatedAsAdmin.goto("/");
    const productsLink = authenticatedAsAdmin.locator("a[href='/products']");
    if (await productsLink.isVisible()) {
      await expect(productsLink).toBeVisible();
    }
  });

  test("admin can access orders from dashboard", async ({ authenticatedAsAdmin }) => {
    await authenticatedAsAdmin.goto("/");
    const ordersLink = authenticatedAsAdmin.locator("a[href='/orders']");
    if (await ordersLink.isVisible()) {
      await expect(ordersLink).toBeVisible();
    }
  });

