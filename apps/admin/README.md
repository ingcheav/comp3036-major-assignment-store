# ElectroMart — Admin Panel

The store administration interface for ElectroMart. Restricted to users with the `ADMIN` role. Built with Next.js 14, NextAuth, Prisma, and Tailwind CSS.

Part of the `comp3036-major-assignment-store` monorepo. Runs on **port 3002**.

## Features

- Dashboard with live stats: product count, order count, total revenue, user count
- Product management: create, edit, delete products; assign categories
- Order viewer: all customer orders with user details and line items
- Admin-only access enforced at the middleware level — non-admins are redirected to `/login`
- Navy `#03254c` top navigation bar with active-link highlighting

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | NextAuth v4 (credentials + JWT) |
| Database | PostgreSQL via Neon + Prisma ORM |
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
NEXTAUTH_URL="http://localhost:3002"
```

Both apps share the same `DATABASE_URL` — they read and write the same Neon PostgreSQL database.

### 2. Generate Prisma client

```bash
pnpm db:generate
```

### 3. Run the dev server

From the monorepo root:

```bash
pnpm admin:dev
```

Or from this directory:

```bash
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002). You will be redirected to `/login` until signed in as an ADMIN.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard — stats + quick actions
│   ├── login/                # Admin sign-in page
│   ├── products/             # Product management (CRUD table + form)
│   ├── orders/               # All customer orders
│   └── api/
│       ├── auth/[...nextauth]/  # NextAuth handler
│       ├── auth/logout/         # Session logout
│       ├── admin/stats/         # GET — dashboard stats (ADMIN only)
│       ├── products/            # GET all, POST create (ADMIN)
│       ├── products/[id]/       # PUT update, DELETE (ADMIN)
│       ├── categories/          # GET all categories
│       └── orders/              # GET all orders (ADMIN only)
├── components/
│   ├── layout/AdminNavbar.tsx   # Navy top nav: Dashboard / Products / Orders
│   └── layout/Providers.tsx     # NextAuth SessionProvider
├── lib/
│   ├── auth.ts               # NextAuth options
│   └── prisma.ts             # Prisma client singleton
├── middleware.ts             # Blocks all routes to non-ADMIN users
└── types/next-auth.d.ts      # Session type augmentation
```

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard stats (products, orders, revenue, users) |
| GET | `/api/products` | All products with category |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/[id]` | Update a product |
| DELETE | `/api/products/[id]` | Delete a product |
| GET | `/api/categories` | All categories |
| GET | `/api/orders` | All customer orders with user and line items |

All routes except NextAuth endpoints require an active ADMIN session.

## Access Control

The middleware matches all routes except `/api/*`, `/_next/*`, `/favicon.ico`, and `/login`. Any request from a user whose JWT `role` is not `"ADMIN"` is redirected to `/login`. This means even authenticated regular users cannot access any admin page.
