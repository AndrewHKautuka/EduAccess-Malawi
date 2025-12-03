import { Pool } from "pg"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment")
}

const pool = new Pool({ connectionString })

export async function query<
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  text: string,
  params: unknown[] = []
): Promise<{ rows: T[]; rowCount: number; durationMs: number }> {
  const start = Date.now()
  const client = await pool.connect()
  try {
    const res = await client.query<T>({ text, values: params })
    const durationMs = Date.now() - start
    if (durationMs > 1000) {
      console.warn(
        `Slow query (${durationMs}ms): ${text} -- params: ${JSON.stringify(params)}`
      )
    }
    return { rows: res.rows, rowCount: res.rowCount ?? 0, durationMs }
  } catch (err: unknown) {
    console.error("DB query error", err)
    throw err
  } finally {
    client.release()
  }
}

export async function healthCheck() {
  try {
    const res = await query("SELECT 1 as ok")
    return { ok: res.rowCount > 0 }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export default pool
