import { test, expect } from "@playwright/test";

test.describe("Button Component", () => {
  test("renders button with text", async ({ page }) => {
    await page.setContent(`<button>Click me</button>`);
    const button = page.locator("button");
    await expect(button).toContainText("Click me");
  });

  test("handles click events", async ({ page }) => {
    await page.setContent(`<button id="test">Click</button>`);
    const button = page.locator("#test");
    await button.click();
    await expect(button).toBeFocused();
  });

  test("shows disabled state", async ({ page }) => {
    await page.setContent(`<button disabled>Disabled</button>`);
    const button = page.locator("button");
    await expect(button).toBeDisabled();
  });
});

test.describe("Form Inputs", () => {
  test("text input accepts values", async ({ page }) => {
    await page.setContent(`<input type="text" />`);
    const input = page.locator("input");
    await input.fill("test");
    await expect(input).toHaveValue("test");
  });

  test("email input validates type", async ({ page }) => {
    await page.setContent(`<input type="email" />`);
    const input = page.locator("input");
    await expect(input).toHaveAttribute("type", "email");
  });

  test("checkbox toggles state", async ({ page }) => {
    await page.setContent(`<input type="checkbox" />`);
    const checkbox = page.locator("input");
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  test("select dropdown works", async ({ page }) => {
    await page.setContent(`
      <select>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </select>
    `);
    const select = page.locator("select");
    await select.selectOption("2");
    await expect(select).toHaveValue("2");
  });
});
