# Electromart — B2C Electronics Store

A full-stack B2C e-commerce application built as the Major Assignment for COMP3036 — Full Stack Development (Option 2). Customers can browse products, manage a shopping cart, and check out via Stripe. Admins can manage products and view all orders through a protected dashboard.

## Academic Context

This store application was developed as the Major Assignment for COMP3036 — Full Stack Development (Option 2 — B2C Store Application). It is built upon the codebase established in Assignments 2.1, 2.2, and 2.3, which has been significantly modified and extended to implement a full B2C e-commerce platform. The original codebase is understood and can be explained and extended appropriately.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| ORM | Prisma 5 |
| Database | PostgreSQL (Neon) |
| Auth | NextAuth.js v4 — credentials provider, JWT sessions |
| Payments | Stripe (test mode, AUD) |
| Testing | Playwright (E2E, Chromium) |
| CI/CD | GitHub Actions + Vercel |

## Setup

### 1. Install dependencies (from monorepo root)

```bash
pnpm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` inside `apps/store`:

```bash
cp apps/store/.env.example apps/store/.env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string — get a free database at neon.tech |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App URL — `http://localhost:3003` for local dev |
| `STRIPE_SECRET_KEY` | Secret key from Stripe dashboard (test keys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key from Stripe dashboard (test keys) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret from Stripe CLI |

### 3. Set up the database

```bash
pnpm --filter @repo/store db:generate
pnpm --filter @repo/store db:push
pnpm --filter @repo/store db:seed
```

### 4. Start the dev server

```bash
pnpm store:dev
```

Open [http://localhost:3003](http://localhost:3003).

### 5. Stripe webhooks (local testing)

```bash
stripe listen --forward-to localhost:3003/api/checkout/webhook
```

## Seed Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@electromart.com` | `admin123` |
| User | `user@electromart.com` | `user123` |

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for full API reference.

## Pages

| Route | Description |
|---|---|
| `/` | Product listing with search and category filter |
| `/products/[id]` | Product detail |
| `/cart` | Shopping cart |
| `/orders` | Order history (auth required) |
| `/checkout/success` | Post-payment confirmation |
| `/login` | Sign in |
| `/register` | Create an account |
| `/admin` | Admin dashboard with stats |
| `/admin/products` | Admin product management |
| `/admin/orders` | Admin view of all orders |

## Testing

```bash
pnpm store:test        # headless
pnpm --filter @repo/store test:ui  # interactive UI mode
```

Test suites cover:
- **Authentication** — register, login, sign out
- **Product listing** — search, category filter, product detail
- **Shopping cart** — add, view, remove items
- **Admin** — dashboard, product table, orders
- **Order history** — orders page for authenticated user

## CI/CD

GitHub Actions runs on every push to `main` or `dev`. The pipeline:
1. Install dependencies
2. Generate Prisma client
3. Push DB schema
4. Seed database
5. Build
6. Run Playwright E2E tests

## Deployment

Deployed on Vercel: [add your URL here once deployed]
