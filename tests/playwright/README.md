# Playwright E2E Tests

Comprehensive end-to-end test suite for the ElectroMart e-commerce application using Playwright, running against a Neon PostgreSQL database.

## Test Structure

```
tests/playwright/tests/
├── auth.setup.ts              # Global authentication setup
├── api.spec.ts                # API endpoint tests
├── admin/                      # Admin application tests
│   ├── fixtures.ts            # Admin fixtures with authentication
│   ├── access.spec.ts         # Admin access control tests
│   ├── dashboard.spec.ts      # Dashboard & stats tests
│   ├── product-management.spec.ts  # Product management tests
│   ├── orders.spec.ts         # Orders list tests
│   ├── orders-detail.spec.ts  # Order details tests
│   ├── categories.spec.ts     # Categories API tests
│   ├── navigation.spec.ts     # Admin navigation tests
│   ├── home-screen.spec.ts    # Dashboard access tests
│   └── complete-workflow.spec.ts   # Complete admin workflows
└── web/                        # Web application tests
    ├── fixtures.ts            # Web fixtures with authentication
    ├── auth.spec.ts           # User authentication tests
    ├── home-screen.spec.ts    # Homepage tests
    ├── category-filter.spec.ts # Filtering & search tests
    ├── shopping.spec.ts       # Shopping functionality tests
    ├── cart.spec.ts           # Cart management tests
    ├── checkout.spec.ts       # Checkout flow tests
    ├── orders.spec.ts         # Order history tests
    ├── profile.spec.ts        # User profile tests
    ├── navigation.spec.ts     # Web navigation tests
    └── complete-workflow.spec.ts   # Complete shopping workflows
```

## Setup

### Prerequisites

- Node.js 18+
- Neon PostgreSQL database with environment variables configured
- Both web (`http://localhost:3001`) and admin (`http://localhost:3002`) servers running

### Environment Setup

Ensure your `.env` files are configured with:
- `DATABASE_URL` pointing to your Neon PostgreSQL instance
- Web app running on port 3001
- Admin app running on port 3002

### Install Dependencies

```bash
pnpm install
```

## Running Tests

### Run All Tests

```bash
pnpm test:e2e
```

### Run Tests by Project

```bash
# Web app tests only
pnpm test:e2e:web

# Admin app tests only
pnpm test:e2e:admin

# API tests only
pnpm test:e2e:api
```

### Run Specific Test File

```bash
pnpm exec playwright test tests/web/cart.spec.ts
```

### Run Tests with UI Mode

```bash
pnpm exec playwright test --ui
```

### Run Tests in Debug Mode

```bash
pnpm exec playwright test --debug
```

### Run Tests and Show Headed Browser

```bash
pnpm exec playwright test --headed
```

## Test Workflow

### Before Tests Start

1. **Global Setup** (`global-setup.ts`):
   - Seeds the Neon PostgreSQL database with test data
   - Creates test users (admin and regular user)
   - Creates test categories and products

### During Tests

1. **Fixtures** (Web & Admin):
   - `authenticatedAsUser`: Logs in as a regular user for web app tests
   - `authenticatedAsAdmin`: Logs in as admin for admin app tests

2. **Test Data**:
   - Tests interact with real database data
   - Each test session uses seeded data from Neon PostgreSQL

### Test Categories

#### Web App Tests
- **Authentication**: Registration, login, logout, validation
- **Product Browsing**: Homepage, product details, filtering
- **Shopping Cart**: Add/remove items, quantity updates
- **Checkout**: Order placement, payment flow
- **Order History**: View past orders, order details
- **User Profile**: Account information, settings
- **Navigation**: Links, routing, page accessibility

#### Admin Tests
- **Access Control**: Role-based access, non-admin redirects
- **Dashboard**: Statistics, KPIs, action buttons
- **Product Management**: List, search, grid view, stock display
- **Order Management**: View all orders, order details, status
- **Navigation**: Admin-specific navigation flows

#### API Tests
- **Products**: Fetch list, single product, validation
- **Categories**: Fetch categories, data validation
- **Error Handling**: Invalid IDs, 404 responses

## Test Features

✅ **Organized Structure**: Tests grouped by feature and app
✅ **Reusable Fixtures**: Authentication fixtures for DRY code
✅ **Real Database**: Tests run against Neon PostgreSQL
✅ **Comprehensive Coverage**: Full user journeys and workflows
✅ **CI/CD Ready**: Configured for GitHub Actions and CI environments
✅ **Screenshot on Failure**: Automatic screenshots for debugging
✅ **Trace Recording**: Debug traces for failed tests

## Database Seeding

Tests automatically seed the database before running:

### Test User Accounts

**Admin User:**
- Email: `admin@electromart.com`
- Password: `admin123`
- Role: ADMIN

**Regular User:**
- Email: `user@electromart.com`
- Password: `user123`
- Role: USER

### Test Data Created

- **Categories**: Laptops, Tablets, Smartphones, Audio, Accessories
- **Products**: Sample products across all categories with stock levels
- **Sample Orders**: Generated from existing users (as needed)

## Troubleshooting

### Tests Fail to Start

1. Ensure servers are running on correct ports
2. Verify database connection: `DATABASE_URL` is set correctly
3. Check that seed has completed: Look for "✅ Database seed completed"

### Authentication Issues

- Clear browser cache: `rm -rf tests/playwright/test-results`
- Re-run global setup: Delete `auth/` directory and re-run tests
- Verify test user exists in Neon PostgreSQL

### Database Sync Issues

- Run manual seed: `pnpm run seed:db` from `packages/db`
- Verify Prisma schema: `pnpm exec prisma generate`
- Check Neon console for data

### Port Already in Use

- Kill existing processes on ports 3001/3002
- Or update ports in `playwright.config.ts` and `.env`

## CI/CD Integration

Tests are configured for CI environments:

```bash
# In GitHub Actions or CI pipeline
pnpm test:e2e
```

The config automatically:
- Uses single worker in CI mode
- Retries failed tests 2 times
- Reports results in list format
- Captures screenshots on failure

## Performance Notes

- Tests run serially (`fullyParallel: false`) to prevent database conflicts
- Database seeding happens once globally before all tests
- Each test is isolated and can run independently
- Typical full test suite runs in 3-5 minutes

## Best Practices

1. **Use Fixtures**: Always use `authenticatedAsUser` or `authenticatedAsAdmin` for logged-in tests
2. **Test Real Flows**: Write tests that simulate actual user behavior
3. **Wait for Elements**: Use proper waits for async operations
4. **Data Isolation**: Don't rely on test order; each test should be independent
5. **Meaningful Names**: Use descriptive test names that explain what's being tested

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Neon PostgreSQL Docs](https://neon.tech/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

