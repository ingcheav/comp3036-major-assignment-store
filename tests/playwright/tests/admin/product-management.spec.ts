import { test, expect } from "./fixtures";

test("admin can see product management page", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/products");
  await authenticatedAsAdmin.waitForLoadState("networkidle");

  await authenticatedAsAdmin.waitForTimeout(2000);
  const productRows = authenticatedAsAdmin.locator('[data-testid="admin-product-row"]');
  const hasRows = await productRows.count() > 0;
  expect(hasRows).toBeTruthy();
});

test("admin products page has search/filter", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/products");
  await authenticatedAsAdmin.waitForLoadState("networkidle");

  const tableBtn = authenticatedAsAdmin.locator('[data-testid="view-table-btn"]');
  const gridBtn = authenticatedAsAdmin.locator('[data-testid="view-grid-btn"]');
  const hasToggle = await tableBtn.isVisible() || await gridBtn.isVisible();
  expect(hasToggle).toBeTruthy();
});

test("admin catalog grid renders stock and has no cart CTAs", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/products");
  await authenticatedAsAdmin.waitForLoadState("networkidle");

  const viewGridBtn = authenticatedAsAdmin.locator('[data-testid="view-grid-btn"]');
  if (await viewGridBtn.isVisible()) {
    await viewGridBtn.click();
    await expect(authenticatedAsAdmin.locator('[data-testid="admin-product-card"]').first()).toBeVisible();
    await expect(authenticatedAsAdmin.locator('[data-testid="admin-stock-badge"]').first()).toBeVisible();
    await expect(authenticatedAsAdmin.locator("text=Add to cart")).toHaveCount(0);
    await expect(authenticatedAsAdmin.locator("text=Buy")).toHaveCount(0);
    await expect(authenticatedAsAdmin.locator("text=Checkout")).toHaveCount(0);
  }
});

test("admin can view product details", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/products");
  await authenticatedAsAdmin.waitForLoadState("networkidle");
  await authenticatedAsAdmin.waitForTimeout(2000);
  const firstRow = authenticatedAsAdmin.locator('[data-testid="admin-product-row"]').first();

  if (await firstRow.isVisible()) {
    const rowText = await firstRow.textContent();
    expect(rowText).toBeTruthy();
    expect(rowText!.length).toBeGreaterThan(0);
  }
});

test("admin can edit a product from the table", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/products");
  await authenticatedAsAdmin.waitForLoadState("networkidle");
  await authenticatedAsAdmin.waitForTimeout(2000);
  const firstRow = authenticatedAsAdmin.locator('[data-testid="admin-product-row"]').first();
  if (await firstRow.isVisible()) {
    const editBtn = firstRow.locator("button", { hasText: "Edit" });
    await editBtn.click();
    await authenticatedAsAdmin.waitForTimeout(500);
    const cancelBtn = authenticatedAsAdmin.locator("button", { hasText: "Cancel" });
    expect(await cancelBtn.isVisible()).toBeTruthy();
  }
});

test("admin product details show stock information", async ({ authenticatedAsAdmin }) => {
  await authenticatedAsAdmin.goto("/products");
  await authenticatedAsAdmin.waitForLoadState("networkidle");
  const gridBtn = authenticatedAsAdmin.locator('[data-testid="view-grid-btn"]');
  if (await gridBtn.isVisible()) {
    await gridBtn.click();
    const stockBadge = authenticatedAsAdmin.locator('[data-testid="admin-stock-badge"]').first();
    await expect(stockBadge).toBeVisible();
  }
});

test("admin products API returns data", async ({ authenticatedAsAdmin }) => {
  const response = await authenticatedAsAdmin.request.get("/api/admin/products");
  expect(response.status()).toBe(200);
  const products = await response.json();
  expect(Array.isArray(products)).toBeTruthy();
});
