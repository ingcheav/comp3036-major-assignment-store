import { test, expect } from "./fixtures";

test("categories API is accessible", async ({ authenticatedAsAdmin }) => {
    const response = await authenticatedAsAdmin.request.get("/api/admin/categories");
    expect(response.status()).toBe(200);
  });

  test("can fetch categories list", async ({ authenticatedAsAdmin }) => {
    const response = await authenticatedAsAdmin.request.get("/api/admin/categories");
    const categories = await response.json();
    expect(Array.isArray(categories)).toBeTruthy();
  });

  test("categories have required fields", async ({ authenticatedAsAdmin }) => {
    const response = await authenticatedAsAdmin.request.get("/api/admin/categories");
    const categories = await response.json();
    
    if (categories.length > 0) {
      expect(categories[0]).toHaveProperty("id");
      expect(categories[0]).toHaveProperty("name");
    }
  });

