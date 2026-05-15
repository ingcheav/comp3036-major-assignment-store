import { FullConfig } from "@playwright/test";
import { spawn } from "child_process";
import path from "path";

/**
 * Runs the database seed script by spawning a child process.
 * Executes `pnpm run db:seed` in the packages/db directory.
 * Resolves when the seed exits cleanly (code 0), rejects otherwise.
 * @returns A Promise that resolves with the exit code on success
 */
async function runSeed() {
  return new Promise((resolve, reject) => {
    console.log("🌱 Running database seed...");
    const seed = spawn("pnpm", ["run", "db:seed"], {
      cwd: path.resolve(__dirname, "../../packages/db"),
      stdio: "inherit",
      shell: true,
    });

    seed.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Database seed completed");
        resolve(code);
      } else {
        console.error(`❌ Database seed failed with code ${code}`);
        reject(new Error(`Seed process exited with code ${code}`));
      }
    });
  });
}

/**
 * Playwright global setup function — runs once before all test suites.
 * Seeds the PostgreSQL database with categories, products, users, and a test order
 * so that all E2E tests have consistent, predictable data to work against.
 * Exits the process with code 1 if seeding fails to prevent tests running on empty data.
 * @param _config - Playwright full configuration (unused but required by the interface)
 */
async function globalSetup(_config: FullConfig) {
  console.log("🚀 Global setup starting...");

  try {
    await runSeed();
    console.log("✅ Global setup completed successfully");
  } catch (error) {
    console.error("❌ Global setup failed:", error);
    process.exit(1);
  }
}

export default globalSetup;
