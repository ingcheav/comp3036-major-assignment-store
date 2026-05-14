import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [["list"]],

  use: {
    trace: "on-first-retry",
    testIdAttribute: "data-testid",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "web",
      testMatch: /web\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3001" },
    },
    {
      name: "admin",
      testMatch: /admin\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3002" },
    },
    {
      name: "api",
      testMatch: /api\.spec\.ts/,
      use: { baseURL: "http://localhost:3001" },
    },
  ],

  globalSetup: require.resolve("./global-setup.ts"),

  webServer: process.env.CI
    ? [
        {
          reuseExistingServer: true,
          command: "pnpm start:web",
          url: "http://localhost:3001",
        },
        {
          reuseExistingServer: true,
          command: "pnpm start:admin",
          url: "http://localhost:3002",
        },
      ]
    : undefined,  
});