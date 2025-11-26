import * as z from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().nonempty("DATABASE_URL must not be empty"),
})

// Perform validation immediately so that invalid configurations fail fast.
const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  const error = z.treeifyError(_env.error).properties
  console.error(
    "❌ Invalid environment variables",
    JSON.stringify(error, null, 2)
  )
  throw new Error("Invalid environment variables")
}

const env = Object.freeze(_env.data)
export default env

type Env = typeof env
export type { Env }
