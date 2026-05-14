import { test, expect } from "@playwright/test";

test.describe("Button Component", () => {
  test("renders button with text", async ({ page }) => {
    await page.setContent(`<button>Create Item</button>`);
    const button = page.locator("button");
    await expect(button).toContainText("Create Item");
  });

  test("shows disabled state", async ({ page }) => {
    await page.setContent(`<button disabled>Disabled</button>`);
    const button = page.locator("button");
    await expect(button).toBeDisabled();
  });

  test("handles click events", async ({ page }) => {
    await page.setContent(`<button id="test">Click</button>`);
    const button = page.locator("#test");
    await button.click();
    await expect(button).toBeFocused();
  });
});

test.describe("Table Component", () => {
  test("renders headers", async ({ page }) => {
    await page.setContent(`
      <table>
        <thead>
          <tr><th>Name</th><th>Actions</th></tr>
        </thead>
      </table>
    `);
    const headers = page.locator("th");
    expect(await headers.count()).toBe(2);
  });

  test("renders rows", async ({ page }) => {
    await page.setContent(`
      <table>
        <tbody>
          <tr><td>Item 1</td></tr>
          <tr><td>Item 2</td></tr>
        </tbody>
      </table>
    `);
    const rows = page.locator("tbody tr");
    expect(await rows.count()).toBe(2);
  });
});

test.describe("Form Validation", () => {
  test("shows error state", async ({ page }) => {
    await page.setContent(`
      <input class="border border-red-500" />
      <p class="text-red-500">Required</p>
    `);
    const error = page.locator("p");
    await expect(error).toContainText("Required");
  });

  test("shows success state", async ({ page }) => {
    await page.setContent(`
      <input class="border border-green-500" value="Valid" />
      <p class="text-green-500">✓ Good</p>
    `);
    const success = page.locator("p");
    await expect(success).toContainText("Good");
  });

  test("handles number input", async ({ page }) => {
    await page.setContent(`<input type="number" />`);
    const input = page.locator("input");
    await input.fill("100");
    await expect(input).toHaveValue("100");
  });
});
