# Electromart API Documentation

Base URL (local): `http://localhost:3003/api`

All authenticated endpoints require a valid NextAuth session cookie. Admin-only endpoints additionally require `role = "ADMIN"` on the session token. Responses are JSON.

---

## Authentication

### POST /api/auth/register

Register a new customer account.

**Auth required:** No

**Request body:**
```json
{ "name": "Jane Smith", "email": "jane@example.com", "password": "secret123" }
```

**Responses:**

| Status | Body | Meaning |
|---|---|---|
| 201 | `{ "id": "...", "name": "...", "email": "..." }` | Account created |
| 400 | `{ "error": "Email already in use" }` | Duplicate email |
| 400 | `{ "error": "Missing required fields" }` | name/email/password absent |

---

### POST /api/auth/[...nextauth]

Handled by NextAuth. Use the credentials provider to sign in.

**Sign-in payload (via `signIn("credentials", ...)`):**
```json
{ "email": "user@example.com", "password": "secret123" }
```

**Session token payload (JWT):**
```json
{ "id": "cuid", "name": "Jane Smith", "email": "jane@example.com", "role": "USER" }
```

`role` is either `"USER"` or `"ADMIN"`.

---

## Products

### GET /api/products

List all products. Supports optional query parameters for filtering.

**Auth required:** No

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `search` | string | Partial match on product name (case-insensitive) |
| `category` | string | Exact match on category name (e.g. `Audio`) |

**Example:** `GET /api/products?search=macbook&category=Laptops`

**Response 200:**
```json
[
  {
    "id": "clx...",
    "name": "MacBook Pro 16\"",
    "description": "Apple M5 Pro chip...",
    "price": 2999.99,
    "stock": 25,
    "imageUrl": "https://...",
    "categoryId": "clx...",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "category": { "id": "clx...", "name": "Laptops" }
  }
]
```

---

### POST /api/products

Create a new product.

**Auth required:** Admin only

**Request body:**
```json
{
  "name": "Sony WH-1000XM6",
  "description": "Industry-leading noise cancellation...",
  "price": 449.99,
  "stock": 30,
  "imageUrl": "https://...",
  "categoryId": "clx..."
}
```

**Responses:**

| Status | Body | Meaning |
|---|---|---|
| 201 | Full product object (with `category`) | Created |
| 400 | `{ "error": "Missing required fields" }` | name/price/categoryId absent |
| 403 | `{ "error": "Forbidden" }` | Not an admin |

---

### GET /api/products/[id]

Fetch a single product by ID.

**Auth required:** No

**Response 200:**
```json
{
  "id": "clx...",
  "name": "AirPods Pro 3",
  "description": "...",
  "price": 349.99,
  "stock": 50,
  "imageUrl": "https://...",
  "categoryId": "clx...",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "category": { "id": "clx...", "name": "Audio" }
}
```

**Response 404:** `{ "error": "Not found" }`

---

### PUT /api/products/[id]

Update an existing product.

**Auth required:** Admin only

**Request body:** Same fields as POST (all required).

**Responses:**

| Status | Body | Meaning |
|---|---|---|
| 200 | Updated product object (with `category`) | Updated |
| 403 | `{ "error": "Forbidden" }` | Not an admin |

---

### DELETE /api/products/[id]

Delete a product.

**Auth required:** Admin only

**Responses:**

| Status | Body | Meaning |
|---|---|---|
| 200 | `{ "success": true }` | Deleted |
| 403 | `{ "error": "Forbidden" }` | Not an admin |

---

## Categories

### GET /api/categories

List all product categories.

**Auth required:** No

**Response 200:**
```json
[
  { "id": "clx...", "name": "Laptops" },
  { "id": "clx...", "name": "Audio" },
  { "id": "clx...", "name": "Smartphones" },
  { "id": "clx...", "name": "Accessories" }
]
```

---

## Cart

All cart endpoints require an authenticated session. Each cart is scoped to the signed-in user.

### GET /api/cart

Retrieve the current user's cart.

**Auth required:** Yes

**Response 200:**
```json
{
  "items": [
    {
      "id": "clx...",
      "userId": "clx...",
      "productId": "clx...",
      "quantity": 2,
      "product": {
        "id": "clx...",
        "name": "Sony WH-1000XM6",
        "price": 449.99,
        "stock": 30,
        "imageUrl": "https://...",
        "category": { "id": "clx...", "name": "Audio" }
      }
    }
  ]
}
```

**Response 401:** `{ "error": "Unauthorized" }`

---

### POST /api/cart

Add a product to the cart. If the product is already in the cart, its quantity is incremented.

**Auth required:** Yes

**Request body:**
```json
{ "productId": "clx...", "quantity": 1 }
```

`quantity` defaults to `1` if omitted.

**Responses:**

| Status | Body | Meaning |
|---|---|---|
| 201 | New cart item object (with `product`) | Added |
| 200 | Updated cart item object (with `product`) | Quantity incremented |
| 401 | `{ "error": "Unauthorized" }` | Not signed in |

---

### PUT /api/cart/[id]

Update the quantity of a specific cart item.

**Auth required:** Yes

**Request body:**
```json
{ "quantity": 3 }
```

**Responses:**

| Status | Body | Meaning |
|---|---|---|
| 200 | Updated cart item object (with `product`) | Updated |
| 400 | `{ "error": "Quantity must be at least 1" }` | quantity < 1 |
| 401 | `{ "error": "Unauthorized" }` | Not signed in |

---

### DELETE /api/cart/[id]

Remove a single item from the cart.

**Auth required:** Yes

**Response 200:** `{ "success": true }`

**Response 401:** `{ "error": "Unauthorized" }`

---

### DELETE /api/cart

Clear the entire cart.

**Auth required:** Yes

**Response 200:** `{ "success": true }`

**Response 401:** `{ "error": "Unauthorized" }`

---

## Checkout

### POST /api/checkout

Create a Stripe Checkout Session from the current user's cart. Returns a redirect URL to Stripe's hosted payment page.

**Auth required:** Yes

**Request body:** None (cart is resolved from session).

**Responses:**

| Status | Body | Meaning |
|---|---|---|
| 200 | `{ "url": "https://checkout.stripe.com/..." }` | Redirect to Stripe |
| 400 | `{ "error": "Cart is empty" }` | Nothing in cart |
| 401 | `{ "error": "Unauthorized" }` | Not signed in |

After successful payment, Stripe redirects the user to `/checkout/success` and sends a webhook event.

---

### POST /api/checkout/webhook

Stripe webhook endpoint. Verifies the `stripe-signature` header and handles `checkout.session.completed` events.

**Auth required:** No (verified via Stripe signature)

On `checkout.session.completed`:
1. Finds the user's cart items.
2. Creates an `Order` with status `PAID` and individual `OrderItem` records.
3. Clears the user's cart.
4. Decrements `stock` on each purchased product.

**Responses:**

| Status | Body | Meaning |
|---|---|---|
| 200 | `{ "ok": true }` | Event handled |
| 400 | `{ "error": "Invalid signature" }` | Signature verification failed |

---

## Orders

### GET /api/orders

Return orders for the signed-in user. Admins receive all orders across all users.

**Auth required:** Yes

**Response 200:**
```json
[
  {
    "id": "clx...",
    "userId": "clx...",
    "total": 899.98,
    "status": "PAID",
    "createdAt": "2026-05-10T03:00:00.000Z",
    "user": { "name": "Test User", "email": "user@electromart.com" },
    "orderItems": [
      {
        "id": "clx...",
        "quantity": 2,
        "price": 449.99,
        "product": { "name": "Sony WH-1000XM6", "imageUrl": "https://..." }
      }
    ]
  }
]
```

Order status values: `PENDING` | `PAID` | `CANCELLED`

**Response 401:** `{ "error": "Unauthorized" }`

---

## Admin

### GET /api/admin/stats

Return aggregate store statistics.

**Auth required:** Admin only

**Response 200:**
```json
{
  "products": 13,
  "orders": 42,
  "revenue": 18749.50,
  "users": 7
}
```

`revenue` is the sum of `total` for all orders with `status = "PAID"`.

**Response 403:** `{ "error": "Forbidden" }`
