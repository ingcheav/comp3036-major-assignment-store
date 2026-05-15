import { test, expect } from "@playwright/test";

test("can fetch products list", async ({ request }) => {
  const response = await request.get("/api/products");
  expect(response.status()).toBe(200);
  const products = await response.json();
  expect(Array.isArray(products)).toBeTruthy();
});

test("products have required fields", async ({ request }) => {
  const response = await request.get("/api/products");
  const products = await response.json();

  if (products.length > 0) {
    const product = products[0];
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("name");
    expect(product).toHaveProperty("price");
  }
});

test("can fetch single product", async ({ request }) => {
  // First get products
  const listResponse = await request.get("/api/products");
  const products = await listResponse.json();

  if (products.length > 0) {
    const productId = products[0].id;
    const response = await request.get(`/api/products/${productId}`);
    expect(response.status()).toBe(200);
    const product = await response.json();
    expect(product.id).toBe(productId);
  }
});

test("can fetch categories list", async ({ request }) => {
  const response = await request.get("/api/categories");
  expect(response.status()).toBe(200);
  const categories = await response.json();
  expect(Array.isArray(categories)).toBeTruthy();
});

test("categories have required fields", async ({ request }) => {
  const response = await request.get("/api/categories");
  const categories = await response.json();

  if (categories.length > 0) {
    const category = categories[0];
    expect(category).toHaveProperty("id");
    expect(category).toHaveProperty("name");
  }
});

test("invalid product ID returns 404", async ({ request }) => {
  const response = await request.get("/api/products/invalid-id-12345");
  expect(response.status()).toBe(404);
});

test("invalid cart item ID returns 404", async ({ request }) => {
  const response = await request.delete("/api/cart/invalid-id-12345");
  expect([401, 404]).toContain(response.status());
});

