import { defineConfig } from "vitest/config";
import path from "node:path";
import { loadEnv } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    env: loadEnv(process.env.NODE_ENV || "test", process.cwd(), ""),
  },
});
