import path from "node:path";

import { defineConfig, devices } from "@playwright/test";

// These values must stay in sync with:
//   PORT      → src/server/config/production.config.ts
//   BASE_PATH → src/server/config/development.config.ts
const PORT = 8888;
const BASE_PATH = "/development";
const BASE_URL = `http://localhost:${PORT}${BASE_PATH}`;
const ROOT_DIR = path.resolve(import.meta.dirname, "..");

export default defineConfig({
    testDir: ".",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: BASE_URL,
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "APP_ENV=development node lib/main.js",
        cwd: ROOT_DIR,
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
    },
});
