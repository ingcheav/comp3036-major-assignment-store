# COMP3036 Full Stack Development — Major Assignment

ElectroMart is a full B2C electronics store built as the Major Assignment for COMP3036 — Full Stack Development. The monorepo contains two Next.js apps that share a single PostgreSQL database.

| App | URL | Role |
|---|---|---|
| `apps/web` | http://localhost:3001 | Customer storefront |
| `apps/admin` | http://localhost:3002 | Store admin panel |

---

## Repository Structure

```
apps/
  web/       ← Customer storefront (port 3001)
  admin/     ← Store admin panel (port 3002)
packages/
  db/        ← Shared Prisma schema + seed (PostgreSQL)
  utils/     ← Shared utility functions
tests/
  playwright/  ← E2E tests for both apps
turbo.json
package.json
```

---

## Applications

### `apps/web` — Customer Storefront

Public-facing B2C e-commerce app built with Next.js 14, NextAuth v4, Prisma, Stripe, and Tailwind CSS.

- Product catalogue (browse all, filter by category, view detail)
- User registration and login (NextAuth credentials + JWT)
- Shopping cart with quantity controls
- Stripe Checkout with webhook order fulfilment
- Order history and user profile page
- Navy `#03254c` colour scheme

### `apps/admin` — Store Admin Panel

Restricted interface accessible only to users with the `ADMIN` role.

- Dashboard with live stats (total products, orders, revenue, registered users)
- Product management — create, edit, delete, assign category, set stock
- Order viewer — all orders with customer name and line-item detail
- Middleware-enforced access control (non-admins redirected to `/login`)

---

## Frontend and Backend

### Frontend

- `apps/web` (customer UI)
- `apps/admin` (admin UI)
- Next.js App Router + Tailwind CSS

### Backend

- Next.js API routes inside both apps
- Authentication via NextAuth credentials + JWT
- Database access via Prisma (`packages/db`)
- Payments via Stripe webhooks

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | NextAuth v4 (credentials provider + JWT) |
| Database | PostgreSQL via [Neon](https://neon.tech) |
| ORM | Prisma 6 |
| Payments | Stripe Checkout + webhooks |
| Styling | Tailwind CSS |
| Monorepo | Turborepo + pnpm workspaces |
| E2E Tests | Playwright |
| CI | GitHub Actions |

---

## Database Schema

Defined in `packages/db/prisma/schema.prisma`:

- **User** — id, name, email, password (bcrypt), role (`USER` / `ADMIN`)
- **Category** — id, name (unique)
- **Product** — id, name, description, price, stock, imageUrl, categoryId
- **CartItem** — userId + productId (unique pair), quantity
- **Order** — userId, total, status (`PENDING` / `PAID`), createdAt
- **OrderItem** — orderId, productId, quantity, price (snapshot at purchase)

---

## Prerequisites

- Node.js ≥ 18
- pnpm 10

```bash
npm install -g pnpm
```

---

## Installation

```bash
pnpm install
```

This also runs `prisma generate` automatically via the `postinstall` hook in `packages/db`.

---

## Environment Variables

Copy the example files and fill in your values:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env
cp packages/db/.env.example packages/db/.env
```

| Variable | Used in | Description |
|---|---|---|
| `DATABASE_URL` | web, admin, db | Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | web, admin | Random secret — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | web | `http://localhost:3001` |
| `NEXTAUTH_URL` | admin | `http://localhost:3002` |
| `STRIPE_SECRET_KEY` | web | Stripe secret key (`sk_test_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | web | Stripe publishable key (`pk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | web | Stripe webhook secret (`whsec_...`) |

Both apps share the same `DATABASE_URL` and Neon database.

### Generate Auth Secret

```bash
openssl rand -base64 32
```

### Stripe CLI for Local Webhook Secret

```bash
stripe listen --forward-to http://localhost:3001/api/checkout/webhook
```

Copy the generated `whsec_...` into `STRIPE_WEBHOOK_SECRET`.

---

## Database Setup

Run these commands once to set up the database:

### 1. Generate the Prisma client

```bash
pnpm --filter @repo/db db:generate
```

### 2. Push the schema to the database

Pushes the Prisma schema to Neon without creating migration files (good for development):

```bash
pnpm --filter @repo/db db:push
```

To use proper migrations instead (creates migration history):

```bash
pnpm --filter @repo/db db:migrate:dev
```

### 3. Seed the database

Populates categories, products, an admin user, and a test user:

```bash
pnpm --filter @repo/db db:seed
```

Seeding is recommended for local development and CI because it creates sample products plus test users.
For production Neon, seeding is optional. Only run it if you want starter data.

Seeded accounts:

| Email | Password | Role |
|---|---|---|
| admin@electromart.com | admin123 | ADMIN |
| user@electromart.com | user123 | USER |

### 4. Open Prisma Studio (optional)

Visual browser for your database:

```bash
pnpm --filter @repo/db studio
```

---

## Running the Apps

### Both apps together (recommended):

```bash
turbo dev
# or
pnpm dev
```

### Customer storefront only (port 3001):

```bash
pnpm web:dev
```

### Admin panel only (port 3002):

```bash
pnpm admin:dev
```

---

## Building

```bash
pnpm build
```

Or individually:

```bash
pnpm --filter @repo/web build
pnpm --filter @repo/admin build
```

---

## Testing

Testing is split into unit, integration, and E2E.

### Unit Tests

```bash
pnpm --filter @repo/utils test
pnpm --filter @repo/ui test
pnpm --filter @repo/web test
```

### Integration Tests

Integration coverage is currently handled by API + Playwright flow validation. Add dedicated integration suites as needed.

### Run all tests:

```bash
turbo test
# or
pnpm --filter @repo/playwright test
```

### Run web tests only:

```bash
pnpm --filter @repo/playwright test-1
```

### Run admin tests only:

```bash
pnpm --filter @repo/playwright test-2
```

### Open Playwright UI:

```bash
pnpm --filter @repo/playwright ui
```

### Generate Playwright Test with Recorder

```bash
pnpm --filter @repo/playwright exec playwright codegen http://localhost:3001
```

---

## CI/CD

GitHub Actions uses `.github/workflows/grading.yml` for grading and automated checks.

---

## Changes from Original Codebase

This project is a modified version of the blog monorepo from Assignments 2.1–2.3, converted into a B2C store. The following summarises what was added, modified, and removed.

### Added

**`apps/web` (new store pages and API)**
- `src/app/products/[id]/page.tsx` — product detail page
- `src/app/cart/page.tsx` — shopping cart
- `src/app/checkout/success/page.tsx` — post-payment confirmation
- `src/app/orders/page.tsx` — order history
- `src/app/profile/page.tsx` — user profile
- `src/app/login/page.tsx` and `src/app/register/page.tsx` — auth pages
- `src/app/api/products/`, `cart/`, `categories/`, `orders/`, `checkout/`, `profile/`, `auth/` — REST API routes
- `src/components/layout/Navbar.tsx` and `Providers.tsx`
- `src/components/product/ProductCard.tsx` and `ProductGrid.tsx`
- `src/lib/auth.ts`, `prisma.ts`, `stripe.ts`
- `src/middleware.ts` — route protection
- `src/types/next-auth.d.ts` — session type extension

**`apps/admin` (full admin rebuild)**
- `src/app/products/page.tsx` and `src/app/orders/page.tsx`
- `src/app/api/products/`, `orders/`, `categories/`, `admin/stats/`, `auth/` — API routes
- `src/components/layout/AdminNavbar.tsx` and `Providers.tsx`
- `src/lib/auth.ts`, `prisma.ts`
- `src/middleware.ts`

**`packages/db`**
- `prisma/schema.prisma` — rewritten for store models (User, Category, Product, CartItem, Order, OrderItem)
- `src/seed.ts` — seeds 13 electronics products across 5 categories

**`tests/playwright`**
- `tests/web.spec.ts` — storefront E2E tests
- `tests/admin.spec.ts` — admin panel E2E tests

### Modified

- `apps/web/src/app/page.tsx` — rewritten as product catalogue homepage
- `apps/web/src/app/layout.tsx` — updated for store branding and Providers
- `apps/web/src/app/globals.css` — store colour scheme
- `apps/admin/src/app/page.tsx` — rewritten as admin dashboard with stats
- `apps/admin/src/app/layout.tsx` — updated for admin branding
- `apps/admin/package.json` — updated dependencies (NextAuth, Prisma, bcryptjs)
- `apps/web/package.json` — added Stripe, NextAuth, Prisma, bcryptjs
- `packages/db/package.json` — added seed script, tsx
- `turbo.json` — added Stripe + NextAuth env vars to `globalEnv`
- `.github/workflows/store-ci.yml` — updated to cover web + admin, added DB seed step

### Deleted

**`apps/web` (blog components removed)**
- `src/components/Blog/` — Detail, List, ListItem components and tests
- `src/components/Menu/` — CategoryList, TagList, HistoryList, LeftMenu, LinkList, SummaryItem
- `src/components/Layout/AppLayout.tsx`, `TopMenu.tsx`
- `src/components/Themes/ThemeContext.tsx`, `ThemeSwitcher.tsx`
- `src/components/Content.tsx`, `Main.tsx`
- `src/app/post/[urlId]/`, `category/[name]/`, `tags/[name]/`, `history/[year]/[month]/`, `search/` — all blog routes
- `src/app/api/likes/route.ts`, `api/seed/route.ts`
- `src/functions/categories.ts`, `tags.ts`, `history.ts` and their tests
- `src/utils/posts.ts`
- `src/types/index.d.ts`
- `vitest.workspace.ts`

**`apps/admin` (blog admin removed)**
- `src/app/api/posts/[urlId]/route.ts`
- `src/app/post/[urlId]/page.tsx`, `posts/create/page.tsx`
- `src/components/CreateScreen.tsx`, `ListScreen.tsx`, `LoginScreen.tsx`, `LogoutButton.tsx`, `UpdateScreen.tsx`
- `src/utils/auth.ts`

**`apps/store/`** — entire directory removed (replaced by the `apps/web` + `apps/admin` split)

**`tests/playwright`** — all old blog test specs and fixtures removed

---

## Academic Context

Developed as the Major Assignment for COMP3036 — Full Stack Development (Option 2 — B2C Store Application). Built on the monorepo scaffold established in Assignments 2.1, 2.2, and 2.3, and significantly extended to deliver a working e-commerce platform.
