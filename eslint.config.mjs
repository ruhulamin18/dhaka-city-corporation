import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next";

export default defineConfig([
  globalIgnores(["**/node_modules/**", "**/.next/**", "backend/**"]),
  {
    extends: [...next],
    settings: {
      next: {
        rootDir: "frontend/",
      },
    },
  },
]);
