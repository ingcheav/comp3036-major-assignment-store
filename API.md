# ElectroMart API Documentation

Base URLs:
- Local: `http://localhost:3001/api` (storefront), `http://localhost:3002/api` (admin)
- Production: `https://electromart-web-two.vercel.app/api` (storefront), `https://electromart-admin-omega.vercel.app/api` (admin)

Protected endpoints require a valid session cookie set by NextAuth after login. See the Auth section for how to obtain one.

> **Note:** Storefront endpoints are served from `apps/web` (port 3001). Admin endpoints are served from `apps/admin` (port 3002).

---

## Authentication _(Storefront — apps/web)_

All endpoints in this section are public (no session required) unless noted.

### Register
`POST /api/auth/register`
Create a new customer account.

**Request**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response** `201`
```json
{
  "id": "clx7k0z9a0000user001bbbb",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "USER"
}
```

**Status codes:** `201` created | `400` missing fields or password shorter than 6 characters | `409` email already registered | `500` server error

---

### Login
`GET /api/auth/[...nextauth]` · `POST /api/auth/[...nextauth]`
NextAuth credentials handler — call via NextAuth's `signIn()` on the client. Sets a JWT session cookie on success.

**Request** (POST)
```json
{
  "email": "string",
  "password": "string"
}
```

**Response** `200` — session cookie set | `401` invalid credentials

---

### Logout
`POST /api/auth/logout`
Validates the current session server-side. Actual token invalidation is performed client-side via NextAuth's `signOut()`. Requires an active session.

**Response** `200`
```json
{
  "success": true
}
```

**Status codes:** `200` success | `401` not authenticated

---

## Products _(Storefront — apps/web)_

GET endpoints are public. POST, PUT, and DELETE require ADMIN role.

### List products
`GET /api/products`
Return all products. Supports optional query parameters for filtering and sorting.

| Query param | Type | Values / notes |
|---|---|---|
| `search` | string | Case-insensitive substring match on product name |
| `category` | string | Filter by category name |
| `minPrice` | number | Minimum price (inclusive) |
| `maxPrice` | number | Maximum price (inclusive) |
| `sortBy` | string | `newest` (default) · `oldest` · `price_asc` · `price_desc` · `name_asc` · `name_desc` |

**Response** `200`
```json
[
  {
    "id": "clx7k2m9p0000abc123def456",
    "name": "Sony WH-1000XM6",
    "description": "HD Noise Cancelling Processor QN3 + Integrated Processor V2, AI-beamforming mics, up to 30-hour battery life. Delivers industry-leading noise cancellation, clearer voice pickup, and premium comfort for everyday and travel use.",
    "price": 449.99,
    "stock": 30,
    "imageUrl": "https://www.jbhifi.com.au/cdn/shop/files/812874-Product-0-I-638827703403543800.jpg?v=1773103926",
    "categoryId": "clx7k1a0b0000xyz789ghi012",
    "createdAt": "2025-01-15T08:30:00.000Z",
    "category": {
      "id": "clx7k1a0b0000xyz789ghi012",
      "name": "Audio"
    }
  }
]
```

**Status codes:** `200` success | `500` server error

---

### Get product
`GET /api/products/[id]`
Return a single product by ID.

**Response** `200`
```json
{
  "id": "clx7k2m9p0000abc123def456",
  "name": "Sony WH-1000XM6",
  "description": "HD Noise Cancelling Processor QN3 + Integrated Processor V2, AI-beamforming mics, up to 30-hour battery life. Delivers industry-leading noise cancellation, clearer voice pickup, and premium comfort for everyday and travel use.",
  "price": 449.99,
  "stock": 30,
  "imageUrl": "https://www.jbhifi.com.au/cdn/shop/files/812874-Product-0-I-638827703403543800.jpg?v=1773103926",
  "categoryId": "clx7k1a0b0000xyz789ghi012",
  "createdAt": "2025-01-15T08:30:00.000Z",
  "category": {
    "id": "clx7k1a0b0000xyz789ghi012",
    "name": "Audio"
  }
}
```

**Status codes:** `200` success | `404` product not found | `500` server error

---

### Create product _(Admin only)_
`POST /api/products`
Create a new product.

**Request**
```json
{
  "name": "string",
  "description": "string",
  "price": 379.99,
  "stock": 12,
  "imageUrl": "string",
  "categoryId": "string"
}
```

**Response** `201`
```json
{
  "id": "clx7k2m9p0000abc123def456",
  "name": "Sony WH-1000XM6",
  "description": "HD Noise Cancelling Processor QN3 + Integrated Processor V2, AI-beamforming mics, up to 30-hour battery life. Delivers industry-leading noise cancellation, clearer voice pickup, and premium comfort for everyday and travel use.",
  "price": 449.99,
  "stock": 30,
  "imageUrl": "https://www.jbhifi.com.au/cdn/shop/files/812874-Product-0-I-638827703403543800.jpg?v=1773103926",
  "categoryId": "clx7k1a0b0000xyz789ghi012",
  "createdAt": "2025-01-15T08:30:00.000Z",
  "category": {
    "id": "clx7k1a0b0000xyz789ghi012",
    "name": "Audio"
  }
}
```

**Status codes:** `201` created | `400` missing required fields | `403` forbidden | `500` server error

---

### Update product _(Admin only)_
`PUT /api/products/[id]`
Update an existing product by ID.

**Request**
```json
{
  "name": "string",
  "description": "string",
  "price": 349.99,
  "stock": 10,
  "imageUrl": "string",
  "categoryId": "string"
}
```

**Response** `200`
```json
{
  "id": "clx7k2m9p0000abc123def456",
  "name": "Sony WH-1000XM6",
  "description": "HD Noise Cancelling Processor QN3 + Integrated Processor V2, AI-beamforming mics, up to 30-hour battery life. Delivers industry-leading noise cancellation, clearer voice pickup, and premium comfort for everyday and travel use.",
  "price": 349.99,
  "stock": 10,
  "imageUrl": "https://www.jbhifi.com.au/cdn/shop/files/812874-Product-0-I-638827703403543800.jpg?v=1773103926",
  "categoryId": "clx7k1a0b0000xyz789ghi012",
  "createdAt": "2025-01-15T08:30:00.000Z",
  "category": {
    "id": "clx7k1a0b0000xyz789ghi012",
    "name": "Audio"
  }
}
```

**Status codes:** `200` success | `403` forbidden | `500` server error

---

### Delete product _(Admin only)_
`DELETE /api/products/[id]`
Permanently delete a product by ID.

**Response** `200`
```json
{
  "success": true
}
```

**Status codes:** `200` success | `403` forbidden | `500` server error

---

## Products _(Admin — apps/admin)_

All endpoints in this section require ADMIN role.

### List all products
`GET /api/admin/products`
Return all products ordered by creation date (newest first).

**Response** `200`
```json
[
  {
    "id": "clx7k2m9p0000abc123def456",
    "name": "Sony WH-1000XM6",
    "description": "HD Noise Cancelling Processor QN3 + Integrated Processor V2, AI-beamforming mics, up to 30-hour battery life. Delivers industry-leading noise cancellation, clearer voice pickup, and premium comfort for everyday and travel use.",
    "price": 449.99,
    "stock": 30,
    "imageUrl": "https://www.jbhifi.com.au/cdn/shop/files/812874-Product-0-I-638827703403543800.jpg?v=1773103926",
    "categoryId": "clx7k1a0b0000xyz789ghi012",
    "createdAt": "2025-01-15T08:30:00.000Z",
    "category": {
      "id": "clx7k1a0b0000xyz789ghi012",
      "name": "Audio"
    }
  }
]
```

**Status codes:** `200` success | `403` forbidden | `500` server error

---

## Categories _(Storefront — apps/web)_

No authentication required.

### List categories
`GET /api/categories`
Return all product categories.

**Response** `200`
```json
[
  {
    "id": "clx7k1a0b0000xyz789ghi012",
    "name": "Audio"
  },
  {
    "id": "clx7k1a0b0001xyz789ghi013",
    "name": "Laptops"
  }
]
```

**Status codes:** `200` success | `500` server error

---

## Categories _(Admin — apps/admin)_

All endpoints in this section require ADMIN role.

### List categories
`GET /api/admin/categories`
Return all product categories.

**Response** `200`
```json
[
  {
    "id": "clx7k1a0b0000xyz789ghi012",
    "name": "Audio"
  },
  {
    "id": "clx7k1a0b0001xyz789ghi013",
    "name": "Laptops"
  }
]
```

**Status codes:** `200` success | `403` forbidden | `500` server error

---

### Create category
`POST /api/admin/categories`
Create a new product category.

**Request**
```json
{
  "name": "string"
}
```

**Response** `200`
```json
{
  "id": "clx7k1a0b0002xyz789ghi014",
  "name": "Wearables"
}
```

**Status codes:** `200` success | `400` name is missing or empty | `403` forbidden | `500` server error

---

### Rename category
`PUT /api/admin/categories/[id]`
Rename an existing category by ID.

**Request**
```json
{
  "name": "string"
}
```

**Response** `200`
```json
{
  "id": "clx7k1a0b0000xyz789ghi012",
  "name": "Headphones & Audio"
}
```

**Status codes:** `200` success | `400` name is missing or empty | `403` forbidden | `500` server error

---

### Delete category
`DELETE /api/admin/categories/[id]`
Delete a category by ID. Returns `409` if the category still has products assigned to it.

**Response** `200`
```json
{
  "success": true
}
```

**Status codes:** `200` success | `403` forbidden | `409` category has products assigned | `500` server error

---

## Cart _(Storefront — apps/web)_

All endpoints in this section require an authenticated session.

### Get cart
`GET /api/cart`
Return the current user's cart with all line items and product details.

**Response** `200`
```json
{
  "items": [
    {
      "id": "clx7k3p1q0000cart001aaaa",
      "userId": "clx7k0z9a0000user001bbbb",
      "productId": "clx7k2m9p0000abc123def456",
      "quantity": 2,
      "product": {
        "id": "clx7k2m9p0000abc123def456",
        "name": "Sony WH-1000XM6",
        "price": 449.99,
        "imageUrl": "https://www.jbhifi.com.au/cdn/shop/files/812874-Product-0-I-638827703403543800.jpg?v=1773103926",
        "category": {
          "id": "clx7k1a0b0000xyz789ghi012",
          "name": "Audio"
        }
      }
    }
  ]
}
```

**Status codes:** `200` success | `401` not authenticated | `500` server error

---

### Add to cart
`POST /api/cart`
Add a product to the cart. If the product is already in the cart the quantity is incremented rather than creating a duplicate entry.

**Request**
```json
{
  "productId": "string",
  "quantity": 1
}
```

**Response** `201` (new item) or `200` (quantity updated)
```json
{
  "id": "clx7k3p1q0000cart001aaaa",
  "userId": "clx7k0z9a0000user001bbbb",
  "productId": "clx7k2m9p0000abc123def456",
  "quantity": 3,
  "product": {
    "id": "clx7k2m9p0000abc123def456",
    "name": "Sony WH-1000XM6",
    "price": 449.99,
    "imageUrl": "https://www.jbhifi.com.au/cdn/shop/files/812874-Product-0-I-638827703403543800.jpg?v=1773103926"
  }
}
```

**Status codes:** `201` new item created | `200` existing item quantity updated | `401` not authenticated | `500` server error

---

### Clear cart
`DELETE /api/cart`
Remove all items from the current user's cart.

**Response** `200`
```json
{
  "success": true
}
```

**Status codes:** `200` success | `401` not authenticated | `500` server error

---

### Update cart item quantity
`PUT /api/cart/[id]`
Set the quantity of a specific cart item. Quantity must be ≥ 1 and must not exceed available stock.

**Request**
```json
{
  "quantity": 2
}
```

**Response** `200`
```json
{
  "id": "clx7k3p1q0000cart001aaaa",
  "userId": "clx7k0z9a0000user001bbbb",
  "productId": "clx7k2m9p0000abc123def456",
  "quantity": 2,
  "product": {
    "id": "clx7k2m9p0000abc123def456",
    "name": "Sony WH-1000XM6",
    "price": 449.99,
    "imageUrl": "https://www.jbhifi.com.au/cdn/shop/files/812874-Product-0-I-638827703403543800.jpg?v=1773103926"
  }
}
```

**Status codes:** `200` success | `400` invalid quantity | `401` not authenticated | `404` cart item not found | `500` server error

---

### Remove cart item
`DELETE /api/cart/[id]`
Remove a single item from the cart by its cart item ID.

**Response** `200`
```json
{
  "success": true
}
```

**Status codes:** `200` success | `401` not authenticated | `404` cart item not found | `500` server error

---

## Checkout _(Storefront — apps/web)_

All endpoints in this section require an authenticated session.

### Create checkout session
`POST /api/checkout`
Create a Stripe Checkout session from the current cart and return the redirect URL. Returns `400` if the cart is empty.

**Response** `200`
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_a1B2c3D4e5F6..."
}
```

**Status codes:** `200` success | `400` cart is empty | `401` not authenticated | `500` checkout creation failed

---

### Stripe webhook
`POST /api/checkout/webhook`
Stripe event receiver — not called directly by clients. Verifies the `stripe-signature` header, then on `checkout.session.completed` creates the order with `PAID` status, decrements product stock, and clears the user's cart in a single Prisma transaction.

**Response** `200`
```json
{
  "received": true
}
```

**Status codes:** `200` event processed | `400` invalid Stripe signature

---

## Profile _(Storefront — apps/web)_

Requires an authenticated session.

### Get profile
`GET /api/profile`
Return the authenticated user's profile details.

**Response** `200`
```json
{
  "id": "clx7k0z9a0000user001bbbb",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "createdAt": "2025-01-10T12:00:00.000Z"
}
```

**Status codes:** `200` success | `401` not authenticated | `404` user not found | `500` server error

---

## Orders _(Storefront — apps/web)_

Requires an authenticated session.

### List orders
`GET /api/orders`
Return the current user's complete order history, sorted newest first.

**Response** `200`
```json
[
  {
    "id": "clx7k5r2s0000ord001cccc",
    "userId": "clx7k0z9a0000user001bbbb",
    "total": 899.98,
    "status": "PAID",
    "createdAt": "2025-02-20T14:45:00.000Z",
    "orderItems": [
      {
        "id": "clx7k5r2s0001item01dddd",
        "orderId": "clx7k5r2s0000ord001cccc",
        "productId": "clx7k2m9p0000abc123def456",
        "quantity": 2,
        "price": 449.99,
        "product": {
          "id": "clx7k2m9p0000abc123def456",
          "name": "Sony WH-1000XM6",
          "price": 449.99
        }
      }
    ]
  }
]
```

**Status codes:** `200` success | `401` not authenticated | `500` server error

---

## Orders _(Admin — apps/admin)_

Requires ADMIN role.

### List all orders
`GET /api/admin/orders`
Return all orders across all users, sorted newest first, with customer details and full line items.

**Response** `200`
```json
[
  {
    "id": "clx7k5r2s0000ord001cccc",
    "userId": "clx7k0z9a0000user001bbbb",
    "total": 899.98,
    "status": "PAID",
    "createdAt": "2025-02-20T14:45:00.000Z",
    "user": {
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "orderItems": [
      {
        "id": "clx7k5r2s0001item01dddd",
        "orderId": "clx7k5r2s0000ord001cccc",
        "productId": "clx7k2m9p0000abc123def456",
        "quantity": 2,
        "price": 449.99,
        "product": {
          "id": "clx7k2m9p0000abc123def456",
          "name": "Sony WH-1000XM6",
          "price": 449.99
        }
      }
    ]
  }
]
```

**Status codes:** `200` success | `403` forbidden | `500` server error

---

## Admin Stats _(Admin — apps/admin)_

Requires ADMIN role.

### Get dashboard stats
`GET /api/admin/stats`
Return aggregate counts and revenue for the admin dashboard. Revenue sums `total` from `PAID` orders only.

**Response** `200`
```json
{
  "products": 13,
  "orders": 42,
  "revenue": 18749.50,
  "users": 5
}
```

**Status codes:** `200` success | `403` forbidden | `500` server error

---

## Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Bad request — missing or invalid fields |
| 401 | Unauthorised — not logged in |
| 403 | Forbidden — insufficient role |
| 404 | Not found |
| 409 | Conflict — resource constraint violated |
| 500 | Internal server error |
