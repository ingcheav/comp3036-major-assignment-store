# ElectroMart — B2C Electronics Store

[![CI](https://github.com/ingcheav/comp3036-major-assignment-store/actions/workflows/grading.yml/badge.svg)](https://github.com/ingcheav/comp3036-major-assignment-store/actions/workflows/grading.yml)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)
![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?logo=stripe)
![Playwright](https://img.shields.io/badge/Playwright-E2E-45ba4b?logo=playwright)
![pnpm](https://img.shields.io/badge/pnpm-Monorepo-f69220?logo=pnpm)

A full-stack B2C electronics store built as the Major Assignment for **COMP3036 — Full Stack Development** (Option 2). ElectroMart is a pnpm + Turborepo monorepo containing two Next.js 14 applications — a customer storefront and a restricted admin dashboard — sharing a single PostgreSQL database via a shared Prisma package.

| App | URL | Purpose |
|---|---|---|
| `apps/web` | http://localhost:3001 | Customer-facing storefront |
| `apps/admin` | http://localhost:3002 | Admin dashboard (ADMIN role required) |

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Environment Variables](#environment-variables)
8. [Database Setup](#database-setup)
9. [Running Locally](#running-locally)
10. [Running Tests](#running-tests)
11. [CI/CD Pipeline](#cicd-pipeline)
12. [Test Credentials](#test-credentials)
13. [Iteration Deliverables](#iteration-deliverables)
14. [Academic Context](#academic-context)

---

## Features

### Customer Storefront (`apps/web`)

| # | Feature | Description |
|---|---|---|
| 1 | **User Authentication** | Register, login, logout with NextAuth credentials provider and JWT sessions. Role-based access control (`USER` / `ADMIN`). |
| 2 | **Shopping Cart** | Add, remove, and update item quantities. Cart state is persisted in the database per user. |
| 3 | **Payment Integration** | Stripe Checkout sessions (test mode) with webhook-driven order fulfilment and automatic stock decrement on successful payment. |
| 4 | **Purchase History** | Orders page listing all past orders with line items, unit prices, quantities, totals, and status badges. |
| 5 | **Product Filtering & Search** | Search by name, filter by category, filter by price range, and sort by price or name — all without page reloads. |

### Admin Dashboard (`apps/admin`)

| # | Feature | Description |
|---|---|---|
| 6 | **Admin Dashboard** | Live stats cards showing total products, orders, revenue, and registered users. |
| — | **Product CRUD** | Create, edit, and delete products; assign categories; manage stock levels. |
| — | **Order Viewer** | View all orders with customer name, status, date, and full line-item detail. |
| — | **Category Management** | Create and manage product categories used across both apps. |
| — | **Access Control** | Middleware enforces `ADMIN` role on every admin route; non-admins are redirected to `/login`. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Auth | [NextAuth v4](https://next-auth.js.org/) — credentials provider + JWT |
| Database | PostgreSQL hosted on [Neon](https://neon.tech) |
| ORM | [Prisma 6](https://www.prisma.io/) |
| Payments | [Stripe](https://stripe.com/) — Checkout sessions + webhooks (test mode) |
| Monorepo | [Turborepo](https://turbo.build/) + pnpm workspaces |
| E2E Tests | [Playwright](https://playwright.dev/) |
| Unit Tests | [Vitest](https://vitest.dev/) |
| CI | [GitHub Actions](https://docs.github.com/en/actions) |

---

## Project Structure

```
comp3036-major-assignment-store/
├── apps/
│   ├── web/                        # Customer storefront (port 3001)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── api/            # REST API routes (products, cart, orders, checkout, auth)
│   │   │   │   ├── cart/           # Shopping cart page
│   │   │   │   ├── checkout/       # Stripe success redirect
│   │   │   │   ├── collections/    # Product collection pages
│   │   │   │   ├── orders/         # Purchase history
│   │   │   │   ├── products/[id]/  # Product detail page
│   │   │   │   ├── login/          # Login page
│   │   │   │   ├── register/       # Registration page
│   │   │   │   └── page.tsx        # Catalogue homepage (search + filter)
│   │   │   ├── components/
│   │   │   │   ├── layout/         # Navbar, Providers
│   │   │   │   └── product/        # ProductCard, ProductGrid
│   │   │   ├── lib/                # auth.ts, prisma.ts, stripe.ts, access.ts
│   │   │   ├── middleware.ts       # Route protection
│   │   │   └── types/             # next-auth.d.ts session extension
│   │   ├── tests/
│   │   │   └── access.test.ts     # Vitest unit tests — canShopAsUser()
│   │   └── .env.example
│   │
│   └── admin/                      # Admin dashboard (port 3002)
│       ├── src/
│       │   ├── app/
│       │   │   ├── api/            # REST API routes (products, orders, categories, stats, auth)
│       │   │   ├── orders/         # Order viewer
│       │   │   ├── products/       # Product CRUD
│       │   │   ├── categories/     # Category management
│       │   │   ├── login/          # Admin login
│       │   │   └── page.tsx        # Dashboard with live stats
│       │   ├── components/
│       │   │   └── layout/         # AdminNavbar, Providers
│       │   ├── lib/                # auth.ts, prisma.ts, access.ts
│       │   └── middleware.ts       # ADMIN role enforcement
│       ├── tests/
│       │   └── access.test.ts     # Vitest unit tests — isAdminRole()
│       └── .env.example
│
├── packages/
│   ├── db/                         # Shared Prisma schema + seed script
│   │   ├── prisma/
│   │   │   └── schema.prisma       # Database models
│   │   ├── src/
│   │   │   └── seed.ts             # Seed: 13 products, 5 categories, 2 users, 1 test order
│   │   └── .env.example
│   ├── ui/                         # Shared UI component tests
│   │   └── tests/
│   │       ├── admin/
│   │       │   └── components.spec.ts  # Playwright — Button, Table, Form Validation
│   │       └── web/
│   │           └── components.spec.ts  # Playwright — Button, Form Inputs
│   └── utils/                      # Shared utility functions
│
├── tests/
│   └── playwright/                 # E2E test suites
│       ├── tests/
│       │   ├── web/                # Storefront E2E specs (auth, cart, checkout, orders, etc.)
│       │   ├── admin/              # Admin E2E specs (dashboard, products, orders, categories)
│       │   └── api.spec.ts         # API endpoint tests
│       ├── global-setup.ts         # Seeds database before tests run
│       └── playwright.config.ts
│
├── .github/
│   └── workflows/
│       └── grading.yml             # GitHub Actions CI pipeline
├── turbo.json
└── package.json
```

---

## Database Schema

Defined in `packages/db/prisma/schema.prisma`:

| Model | Key Fields |
|---|---|
| `User` | id, name, email, password (bcrypt), role (`USER` \| `ADMIN`) |
| `Category` | id, name (unique) |
| `Product` | id, name, description, price, stock, imageUrl, categoryId |
| `CartItem` | userId + productId (unique pair), quantity |
| `Order` | id, userId, total, status (`PENDING` \| `PAID`), createdAt |
| `OrderItem` | orderId, productId, quantity, price (snapshot at purchase time) |

---

## Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 10

```bash
# Install pnpm globally
npm install -g pnpm
```

- A **Neon** PostgreSQL database — free tier at https://neon.tech
- A **Stripe** account (test mode) — https://dashboard.stripe.com
- **Stripe CLI** (for local webhook testing) — https://docs.stripe.com/stripe-cli/install

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/ingcheav/comp3036-major-assignment-store.git
cd comp3036-major-assignment-store

# 2. Install all workspace dependencies
pnpm install
```

> `pnpm install` automatically runs `prisma generate` via the `postinstall` hook in `packages/db`, so the Prisma client is generated immediately.

---

## Environment Variables

Copy the example files and fill in your values:

```bash
cp apps/web/.env.example    apps/web/.env
cp apps/admin/.env.example  apps/admin/.env
cp packages/db/.env.example packages/db/.env
```

### `apps/web/.env`

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string (e.g. `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`) |
| `NEXTAUTH_SECRET` | Random secret used to sign JWT sessions — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Must be `http://localhost:3001` for local development |
| `STRIPE_SECRET_KEY` | Stripe secret key from the dashboard (`sk_test_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_...`) — safe to expose to the browser |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret from the Stripe CLI (`whsec_...`) |

### `apps/admin/.env`

| Variable | Description |
|---|---|
| `DATABASE_URL` | Same Neon connection string as `apps/web` |
| `NEXTAUTH_SECRET` | Same secret as `apps/web` (or a separate one — both work) |
| `NEXTAUTH_URL` | Must be `http://localhost:3002` for local development |

### `packages/db/.env`

| Variable | Description |
|---|---|
| `DATABASE_URL` | Same Neon connection string — used by `prisma db push` and `prisma db seed` |

### Generate a NextAuth Secret

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and paste it as your `NEXTAUTH_SECRET` value.

### Set Up the Stripe Webhook Secret (local)

1. Install the Stripe CLI by following the official guide for your OS (Windows, macOS, Linux):
   - https://docs.stripe.com/stripe-cli/install

2. Add the Stripe CLI to your PATH (Windows PowerShell example):
```bash
$env:PATH += ";C:\stripe_1.40.9_windows_x86_64"
```

3. Login to your Stripe account:
```bash
stripe login
```

4. Start the webhook listener — it prints the webhook secret on startup:
```bash
stripe listen --forward-to http://localhost:3001/api/checkout/webhook
```

5. Copy the printed `whsec_...` value into `STRIPE_WEBHOOK_SECRET` in `apps/web/.env`

---

## Database Setup

Run these once after setting your `DATABASE_URL`:

```bash
# 1. Generate the Prisma client
pnpm --filter @repo/db db:generate

# 2. Push the Prisma schema to Neon (no migration files — fast for development)
pnpm --filter @repo/db db:push

# 3. Seed the database with categories, products, users, and a test order
pnpm --filter @repo/db db:seed
```

To use proper tracked migrations instead of `db push`:

```bash
pnpm --filter @repo/db db:migrate:dev
```

To open Prisma Studio (visual database browser):

```bash
pnpm --filter @repo/db studio
```

---

## Running Locally

### Both apps simultaneously (recommended)

```bash
pnpm dev
# or
turbo dev
```

### Individual apps

```bash
# Customer storefront — http://localhost:3001
pnpm --filter @repo/web dev

# Admin dashboard — http://localhost:3002
pnpm --filter @repo/admin dev
```

### Production build

```bash
pnpm build
# or
turbo build
```

---

## Running Tests

> **Important:** The dev servers for both apps must be running before executing Playwright E2E tests.

```bash
# Terminal 1 — start both apps
turbo dev

# Terminal 2 — run all Playwright E2E tests
turbo test
```

### Targeted Playwright runs

```bash
# Make sure dev servers are running first in another terminal
pnpm dev

# Storefront E2E tests only
pnpm --filter @repo/playwright test-1

# Admin E2E tests only
pnpm --filter @repo/playwright test-2

# API E2E tests only
pnpm --filter @repo/playwright test-3

# Open the Playwright UI (interactive mode)
pnpm --filter @repo/playwright ui
```

### Unit tests (Vitest — no server required)

```bash
# Web access rules — canShopAsUser()
pnpm --filter @repo/web test:unit

# Admin access rules — isAdminRole()
pnpm --filter @repo/admin test:unit

# Utils tests
pnpm --filter @repo/utils test
```

### UI component tests (Playwright — no server required)

```bash
# Button, Table, Form component tests
pnpm --filter @repo/ui test
```

### Test summary

| Suite | Location | Runner | Count |
|---|---|---|---|
| Vitest unit — utils | `packages/utils/src/` | `testUtils` | 2 |
| Playwright UI components | `packages/ui/tests/` | `testUi` | 15 |
| Vitest unit — web + admin | `apps/web/tests/` + `apps/admin/tests/` | `testComponent` | 3 |
| Playwright E2E — Storefront | `tests/playwright/tests/web/` | `npm1` | 59 |
| Playwright E2E — Admin | `tests/playwright/tests/admin/` | `npm2` | 41 |
| Playwright E2E — API | `tests/playwright/tests/api.spec.ts` | `npm3` | 7 |
| **Total** | | | **127** |

---

## CI/CD Pipeline

The GitHub Actions workflow at [`.github/workflows/grading.yml`](.github/workflows/grading.yml) runs automatically on every push.

### What it does

```
push / workflow_dispatch
        │
        ▼
┌─────────────────────────────────────────┐
│  ubuntu-latest runner                   │
│                                         │
│  Service: postgres:16 container         │
│  (postgres/postgres @ localhost:5432)   │
└─────────────────────────────────────────┘
        │
        ▼  Steps
  1. pnpm install                 — install all workspace dependencies
  2. playwright install chromium  — install browser for E2E tests
  3. pnpm --filter @repo/db push  — push Prisma schema to the CI database
  4. pnpm turbo build             — type-check and build all apps

Unit tests (autograded):
  5. packages/utils  pnpm test         (Unit 1 — Utils)
  6. packages/ui     pnpm test         (Unit 2 — UI Components)
  7. apps/web + apps/admin  pnpm test:unit  (Unit 3 — Storefront and Admin)

Playwright E2E (autograded):
  8.  tests/playwright  pnpm test-1   (Integration 1 — Storefront)
  9.  tests/playwright  pnpm test-2   (Integration 2 — Admin)
  10. tests/playwright  pnpm test-3   (Integration 3 — API)
        │
        ▼
  Autograding Reporter aggregates all results
```

The CI pipeline uses a **real PostgreSQL 16 service container** (not mocks), ensuring database behaviour matches production. `continue-on-error: true` on each step means all tests run and are reported even when some fail.

---

## Test Credentials

These accounts are created by `pnpm --filter @repo/db db:seed`:

| Role | Email | Password |
|---|---|---|
| Admin | admin@electromart.com | admin123 |
| User | user@electromart.com | user123 |

> Use the **Admin** account to access the admin dashboard at http://localhost:3002.
> Use the **User** account to test the customer storefront at http://localhost:3001.

---

## Iteration Deliverables

### Iteration 1 — Week 12 (COMPLETED)

- All 6 core features implemented end-to-end (frontend + backend API routes):
  1. **User Authentication** — register, login, logout, JWT sessions, role-based access (USER/ADMIN)
  2. **Shopping Cart** — add, remove, update quantity, persisted in database per user
  3. **Payment Integration** — Stripe Checkout sessions, webhook-driven order fulfilment, stock decrement
  4. **Purchase History** — orders page with line items, unit prices, quantities, totals, status badges
  5. **Product Filtering & Search** — search by name, filter by category, price range, sort (6 modes)
  6. **Admin Dashboard** — live stats, full product CRUD, order viewer, category management
- **127 tests passing** — 107 Playwright E2E, 15 Playwright UI component, 5 Vitest unit
- GitHub Actions CI pipeline with PostgreSQL service container
- Role-based access control enforced via Next.js middleware in both apps
- Admin app with dashboard stats, product CRUD, order viewer, and category management
- Customer storefront with catalogue, search/filter, cart, Stripe checkout, and order history
- Database seeded with 13 electronics products across 5 categories, 2 users, and a test order
- Comprehensive error handling (try/catch) on all database-touching API routes

### Iteration 2 — Week 14 (Planned)

- [ ] API documentation (`API.md` covering all endpoints for both apps)
- [ ] Vercel deployment — `apps/web` and `apps/admin` as separate Vercel projects
- [ ] Demo video (due Friday 5 June 2026)
- [ ] Final polish, stability improvements, and any outstanding bug fixes

---

## Academic Context

**Course:** COMP3036 — Full Stack Development
**Assignment:** Major Assignment — Option 2 (B2C Store Application)
**Institution:** Western Sydney University

The monorepo workspace (Turborepo + pnpm) was inherited from the Assignment 2 blog codebase. The original blog code was modified and replaced to build the ElectroMart store — every page, API route, component, authentication layer, database schema, Stripe integration, cart logic, admin dashboard, middleware, and E2E test was written specifically for this assignment.

**Grading breakdown:**

| Criterion | Weight |
|---|---|
| Functionality | 40% |
| Code Quality | 20% |
| UI/UX | 20% |
| Documentation | 10% |
| Creativity & Effort | 10% |