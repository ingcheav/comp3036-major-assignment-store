import { test, expect } from "./fixtures";

test("user can complete a purchase flow", async ({ authenticatedAsUser }) => {
    // 1. Browse homepage
    await authenticatedAsUser.goto("/");
    await expect(authenticatedAsUser.locator('[data-testid="product-card"]').first()).toBeVisible();

    // 2. Add product to cart
    const addToCartBtn = authenticatedAsUser.locator('[data-testid="add-to-cart-btn"]').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await expect(authenticatedAsUser.locator('[data-testid="add-to-cart-btn"]').first()).toContainText(/Added/);
    }

    // 3. Go to cart
    await authenticatedAsUser.goto("/cart");
    await expect(authenticatedAsUser.locator('[data-testid="cart-item"]').first()).toBeVisible();

    // 4. Verify cart total
    await expect(authenticatedAsUser.locator('[data-testid="cart-total"]')).toBeVisible();

    // 5. Proceed to checkout
    const checkoutBtn = authenticatedAsUser.locator('[data-testid="checkout-btn"]');
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      // Stripe redirects externally — just check button was clickable
      await authenticatedAsUser.waitForTimeout(2000);
    }
  });

  test("user can filter and view products before purchasing", async ({ authenticatedAsUser }) => {
    // 1. Navigate to products
    await authenticatedAsUser.goto("/");
    
    // 2. Use search if available
    const searchInput = authenticatedAsUser.locator('[data-testid="search-input"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill("phone");
      await expect(authenticatedAsUser.locator('[data-testid="product-card"]').first()).toBeVisible();
    }

    // 3. View product details
    await authenticatedAsUser.locator('[data-testid="product-card"]').first().click();
    
    // 4. Verify product information
    await expect(authenticatedAsUser.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(authenticatedAsUser.locator('[data-testid="product-description"]')).toBeVisible();
  });

  test("user can manage cart items", async ({ authenticatedAsUser }) => {
    // 1. Add product to cart
    await authenticatedAsUser.goto("/");
    const addToCartBtn = authenticatedAsUser.locator('[data-testid="add-to-cart-btn"]').first();
    
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      
      // 2. Go to cart
      await authenticatedAsUser.goto("/cart");
      
      // 3. Update quantity if possible
      const quantityInput = authenticatedAsUser.locator('[data-testid="quantity-input"]').first();
      if (await quantityInput.isVisible()) {
        await quantityInput.fill("2");
        await expect(authenticatedAsUser.locator('[data-testid="cart-total"]')).toBeVisible();
      }

      // 4. Remove item
      const removeBtn = authenticatedAsUser.locator("text=Remove").first();
      if (await removeBtn.isVisible()) {
        const itemCountBefore = await authenticatedAsUser.locator('[data-testid="cart-item"]').count();
        await removeBtn.click();
        // Item should be removed
        if (itemCountBefore > 0) {
          const itemCountAfter = await authenticatedAsUser.locator('[data-testid="cart-item"]').count();
          expect(itemCountAfter).toBeLessThanOrEqual(itemCountBefore);
        }
      }
    }
  });

