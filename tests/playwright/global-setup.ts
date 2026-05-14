import { FullConfig } from "@playwright/test";
import { spawn } from "child_process";
import path from "path";

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

async function globalSetup(_config: FullConfig) {
  console.log("🚀 Global setup starting...");

  try {
    // Seed the Neon PostgreSQL database with test data
    await runSeed();
    console.log("✅ Global setup completed successfully");
  } catch (error) {
    console.error("❌ Global setup failed:", error);
    process.exit(1);
  }
}

export default globalSetup;
