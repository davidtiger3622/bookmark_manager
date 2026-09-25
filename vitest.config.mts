import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      all: true,
      reporter: ["text", "html", "json-summary"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}"],
      thresholds: {
        lines: 98,
        statements: 97,
        functions: 98,
        // Set just below current (96.55%) to leave room for the two
        // untestable `typeof window === "undefined"` SSR guards in
        // storage.ts / appearance.ts without masking a real regression.
        branches: 95,
      },
    },
  },
});
