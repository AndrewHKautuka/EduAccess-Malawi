import "dotenv/config"
import { defineConfig } from "drizzle-kit"

import env from "@/config/env"

export default defineConfig({
  out: "./drizzle",
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
