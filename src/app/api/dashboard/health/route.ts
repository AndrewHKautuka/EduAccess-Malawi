import { NextResponse } from "next/server"

import { healthCheck } from "../../../../lib/db"

export async function GET() {
  const start = Date.now()
  try {
    const status = await healthCheck()
    const duration = Date.now() - start
    return NextResponse.json({
      status: status.ok ? "ok" : "error",
      timestamp: new Date().toISOString(),
      db: status,
      durationMs: duration,
    })
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: (err as Error).message,
      },
      { status: 500 }
    )
  }
}
