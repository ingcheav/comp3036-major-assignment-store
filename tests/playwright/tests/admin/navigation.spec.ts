import { test, expect } from "./fixtures";

test("admin navigation is accessible", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/");
  const nav = authenticatedAsAdmin.locator("nav");
  await expect(nav).toBeVisible();
});

test("admin can navigate between sections", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/");
  await authenticatedAsAdmin.locator("a[href='/products']").first().click();
  await expect(authenticatedAsAdmin).toHaveURL(/products/);

  await authenticatedAsAdmin.goto("/");
  await authenticatedAsAdmin.locator("a[href='/orders']").first().click();
  await expect(authenticatedAsAdmin).toHaveURL(/orders/);
});

test("admin dashboard link exists", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/products");
  const dashboardLink = authenticatedAsAdmin.locator("a[href='/']").first();
  expect(await dashboardLink.isVisible()).toBeTruthy();
});

test("admin page shows sign out", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/");
  await authenticatedAsAdmin.waitForLoadState("networkidle");
  const signOutBtn = authenticatedAsAdmin.locator("button", { hasText: "Sign out" });
  await expect(signOutBtn).toBeVisible({ timeout: 10000 });
});

test("404 page shows for admin invalid route", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/invalid-route");
  const notFound = authenticatedAsAdmin.locator("text=404").first();
  const isNotFoundPage = await notFound.isVisible();
  const url = authenticatedAsAdmin.url();
  const urlRedirected = !url.includes("invalid-route");
  expect(isNotFoundPage || urlRedirected).toBeTruthy();
});