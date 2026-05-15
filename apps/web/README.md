# ElectroMart — Customer Storefront

The B2C customer-facing app for ElectroMart, a premium electronics store. Built with Next.js 14, NextAuth, Prisma, Tailwind CSS, and Stripe.

Part of the `comp3036-major-assignment-store` monorepo. Runs on **port 3001**.

## Features

- Browse and search products by name and category
- Product detail pages with related products
- Shopping cart (add, update quantity, remove)
- Stripe checkout with webhook order fulfillment
- User registration and login (JWT sessions via NextAuth)
- Order history and profile page
- Admin users are recognised — cart and checkout are hidden for them

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | NextAuth v4 (credentials + JWT) |
| Database | PostgreSQL via Neon + Prisma ORM |
| Payments | Stripe Checkout + webhooks |
| Styling | Tailwind CSS 3 (`#03254c` navy theme) |

## Getting Started

### 1. Environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3001"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 2. Generate Prisma client

```bash
pnpm db:generate
```

### 3. Run the dev server

From the monorepo root:

```bash
pnpm web:dev
```

Or from this directory:

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001).

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home — product grid
│   ├── login/                    # Sign-in page
│   ├── register/                 # Account creation
│   ├── cart/                     # Shopping cart
│   ├── checkout/success/         # Post-payment confirmation
│   ├── orders/                   # Order history
│   ├── profile/                  # User profile
│   ├── products/[id]/            # Product detail
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth handler
│       ├── auth/logout/          # Session logout
│       ├── auth/register/        # User registration
│       ├── products/             # GET all, POST (admin)
│       ├── products/[id]/        # GET one, PUT/DELETE (admin)
│       ├── categories/           # GET all categories
│       ├── cart/                 # GET, POST, DELETE cart
│       ├── cart/[id]/            # PUT/DELETE cart item
│       ├── checkout/             # POST — create Stripe session
│       ├── checkout/webhook/     # Stripe webhook → create order
│       ├── orders/               # GET user orders
│       └── profile/              # GET user profile
├── components/
│   ├── layout/Navbar.tsx         # Sticky navbar with cart badge
│   ├── layout/Providers.tsx      # NextAuth SessionProvider
│   ├── product/ProductCard.tsx   # Product tile with add-to-cart
│   └── product/ProductGrid.tsx   # Filtered, searchable grid
├── lib/
│   ├── auth.ts                   # NextAuth options
│   ├── prisma.ts                 # Prisma client singleton
│   └── stripe.ts                 # Stripe client singleton
├── middleware.ts                 # Protects /cart, /orders, /profile
└── types/next-auth.d.ts          # Session type augmentation
```

## API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | — | List products (search & category filter) |
| GET | `/api/products/[id]` | — | Single product |
| POST | `/api/products` | ADMIN | Create product |
| PUT | `/api/products/[id]` | ADMIN | Update product |
| DELETE | `/api/products/[id]` | ADMIN | Delete product |
| GET | `/api/categories` | — | List categories |
| GET | `/api/cart` | USER | Get cart items |
| POST | `/api/cart` | USER | Add to cart |
| DELETE | `/api/cart` | USER | Clear cart |
| PUT | `/api/cart/[id]` | USER | Update item quantity |
| DELETE | `/api/cart/[id]` | USER | Remove item |
| POST | `/api/checkout` | USER | Create Stripe checkout session |
| POST | `/api/checkout/webhook` | Stripe | Fulfil order on payment |
| GET | `/api/orders` | USER | Order history |
| GET | `/api/profile` | USER | User profile |
| POST | `/api/auth/register` | — | Create new account |
| POST | `/api/auth/logout` | USER | Logout helper |
