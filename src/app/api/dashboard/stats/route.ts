import { NextResponse } from "next/server"

// Main stats route: optional dispatcher to sub-routes or simple info
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Use /stats/national or /stats/subdivision",
  })
}
