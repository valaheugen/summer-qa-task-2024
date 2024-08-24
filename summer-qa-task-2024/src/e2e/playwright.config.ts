import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    headless: false,
    viewport: { width: 1680, height: 1220 },
    baseURL: "http://localhost:5174/",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  retries: 1,
  reporter: "list",
});
