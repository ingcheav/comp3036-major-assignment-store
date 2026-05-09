# COMP3036 Full Stack Development — Major Assignment

The B2C Store application is located in `apps/store` and runs on port 3003.
The blog application (`apps/web`, `apps/admin`) is the original Assignment 2 
codebase that this project builds upon.

## Academic Context

This project was developed as the Major Assignment for COMP3036 — Full Stack Development (Option 2 — B2C Store Application). It is built upon the codebase established in Assignments 2.1, 2.2, and 2.3, which has been significantly modified and extended to implement a full B2C e-commerce platform. The original codebase is understood and can be explained and extended appropriately.

---

## Repository Structure

```
apps/
  admin/     ← Blog admin interface (Assignments 2.1, 2.2, 2.3)
  web/       ← Blog client application (Assignments 2.1, 2.2, 2.3)
  store/     ← B2C Electromart store (Major Assignment — Option 2)
packages/
  db/        ← Shared database connection (Prisma)
  ui/        ← Shared React component library
  utils/     ← Shared utility functions
  env/       ← Shared environment validation
  eslint-config/
  tailwind-config/
  typescript-config/
tests/
  playwright-admin/   ← E2E tests for blog admin
  playwright-web/     ← E2E tests for blog client
  storybook/          ← Component development environment
README.md
turbo.json
package.json
```

---

## Applications

### `apps/web` + `apps/admin` — Blog Application (Assignments 2.1, 2.2, 2.3)

A full-stack blog platform built with Next.js 15, React 19, Prisma, and Tailwind CSS.

- **apps/web** — Public-facing blog client (port 3001)
- **apps/admin** — Admin interface for managing posts (port 3002)

Features implemented across assignments:
- Blog post listing, detail, search, category, tag, and history views
- Admin authentication with JWT (httpOnly cookie)
- Full CRUD for blog posts with Markdown support
- Server-side data fetching and filtering
- Like/view tracking per post
- E2E tests with Playwright + unit tests with Vitest

### `apps/store` — B2C Electromart Store (Major Assignment — Option 2)

A full-featured B2C e-commerce platform built with Next.js 14, NextAuth, Prisma, Stripe, and Tailwind CSS.

- Runs on port 3003
- PostgreSQL database via Neon

Features:
- Product catalogue with search and category filtering
- User authentication (register/login via NextAuth)
- Shopping cart (add, remove, view)
- Stripe checkout with webhook order fulfilment
- Order history for authenticated users
- Admin dashboard: product management, order management, revenue stats
- E2E tests with Playwright

---

## Prerequisites

Install pnpm and turbo globally:

```bash
npm install -g pnpm
pnpm add -g turbo
```

## Installing the Project

From the repo root:

```bash
pnpm install
```

Install Playwright browsers for the blog tests:

```bash
pnpm --filter playwright-web exec playwright install chromium
pnpm --filter playwright-admin exec playwright install chromium
```

Install Playwright browsers for the store:

```bash
pnpm --filter store exec playwright install chromium
```

## Environment Variables

Copy `.env.example` to `.env` in the relevant packages:

| Location | Variables |
|---|---|
| `packages/db/.env` | `DATABASE_URL` (blog DB) |
| `apps/admin/.env` | `JWT_SECRET`, `PASSWORD` |
| `apps/store/.env` | `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` |

## Running the Project

### All apps (blog only):

```bash
turbo dev
```

Starts blog client at [http://localhost:3001](http://localhost:3001) and admin at [http://localhost:3002](http://localhost:3002).

### Store only:

```bash
pnpm store:dev
```

Starts the store at [http://localhost:3003](http://localhost:3003).

### Store database setup:

```bash
pnpm --filter store db:push
pnpm --filter store db:seed
```

## Running Tests

### Blog tests (Assignments 2.1 / 2.2 / 2.3):

```bash
turbo test-1   # Assignment 2.1 — Blog client
turbo test-2   # Assignment 2.2 — Admin
turbo test-3   # Assignment 2.3 — Backend
turbo all:test # All blog tests
```

### Store E2E tests:

```bash
pnpm store:test
```

Or with UI:

```bash
pnpm --filter store test:ui
```

## Building

### All apps:

```bash
turbo build
```

### Store only:

```bash
pnpm store:build
```

---

## Assignment 2 — Original Requirements

### 👾 Requirements — Assignment 2.1 — Client

#### HOME SCREEN

- [ ] User must see only the "active" posts
- [ ] User must see the list of blog post categories, where each category points to UI showing only posts of that category
- [ ] User must see the list of blog post tags, where each tag points to UI showing only posts of that category
- [ ] User must see the history of blog posts, showing month and year, where each month, year tuple points to UI showing only posts of that category
- [ ] Tags and history items shown are only considered from active posts
- [ ] The list shows the following items:
  - blog title, pointing to detail page
  - short description
  - date
  - image
  - tags
  - likes
  - views
- [ ] User must be able to switch between dark and light theme with a button
      The dark theme setting is stored in the "data-theme" attribute on html element
- [ ] There is a search functionality that filters blogs based on string found in title or description, redirecting to search page

#### DETAIL SCREEN

- [ ] Detail page shows the same items as list item, but the short description is replaced by formatted long description
- [ ] Detail text is stored as Markdown, which needs to be converted to HTML

#### CATEGORY SCREEN

- [ ] Displays posts from the category from url (e.g. /category/react)
- [ ] Displays "0 Posts" when search does no posts have that category

#### HISTORY SCREEN

- [ ] Displays posts from year and month specified in the url (e.g. /history/2024/12)
- [ ] Displays "0 Posts" when no posts are from that given month and year

#### TAG SCREEN

- [ ] Displays posts with the tag url (e.g. /tags/dev-tools)
- [ ] Displays "0 Posts" when search does no posts have that tag

#### SEARCH SCREEN

- [ ] Displays results based on search string stored in the query string (e.g. /search?q=Fat)
- [ ] Displays "0 Posts" when search does not find anything

### 👾 Requirements — Assignment 2.2 — Admin

#### ADMIN HOME SCREEN

- [ ] Shows Login screen if not logged
- [ ] Shows List screen if logged
- [ ] There must be a logout button
- [ ] Clicking the logout button logs the user out
- [ ] Authenticate the current client using a hard-coded password
- [ ] Use a httpOnly cookie and name it "auth_token" to remember the signed-in state.

#### ADMIN LIST SCREEN

- [ ] Shows both active and inactive posts
- [ ] Article list is only accessible to logged-in users.
- [ ] There is a filter screen that allows filtering posts by: Title or content, Tags, Date, Visibility
- [ ] You can combine multiple filters
- [ ] Users can sort posts by name or creation date, both ascending and descending
- [ ] The post list displays a list of filtered items with image, title, category, tags, and active status
- [ ] Clicking on the title takes the user to the MODIFY SCREEN
- [ ] There is a button to create new posts

#### ADMIN CREATE and UPDATE screen

- [ ] Page is only accessible to logged in user
- [ ] Fields: Title, Description (max 200 chars), Content (markdown), Tag List, Image URL
- [ ] Description has a "Preview" button rendering markdown
- [ ] Under the image input is an image preview
- [ ] "Save" button validates fields before saving

### 👾 Requirements — Assignment 2.3 — Backend

#### BACKEND / CLIENT

- [ ] Data is loaded from the database backend
- [ ] Data filtering is done server side
- [ ] Each visit increases the post "views" count by one
- [ ] User can "like" the post on the detail screen (not list screen)
- [ ] Liking increases like count by one; user can only like once (by IP); user can unlike

#### BACKEND / ADMIN / AUTHORISATION

- [ ] Password is checked on server in `/api/auth` route
- [ ] POST method for login, DELETE method for logout
- [ ] Admin home checks for JWT token and verifies it

#### BACKEND / ADMIN / LIST + UPDATE + CREATE

- [ ] Logged in user can activate / deactivate posts
- [ ] Logged in user can save changes and create new posts to the database
