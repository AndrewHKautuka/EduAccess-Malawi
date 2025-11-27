import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import prettierConfig from "eslint-config-prettier/flat"
import drizzle from "eslint-plugin-drizzle"
import importZod from "eslint-plugin-import-zod"
import prettier from "eslint-plugin-prettier"
import { defineConfig, globalIgnores } from "eslint/config"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  ...importZod.configs.recommended,
  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    plugins: {
      drizzle,
    },
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "drizzle/enforce-delete-with-where": "error",
      "drizzle/enforce-update-with-where": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules",
    ".vscode",
    ".github",
    "pnpm-lock.yaml",
    "drizzle",
  ]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
])

export default eslintConfig
