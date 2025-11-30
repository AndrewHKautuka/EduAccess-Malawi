import { NextResponse } from "next/server"

import { getExampleCoverage } from "~/example/data/example-data"

export async function GET() {
  const result = await getExampleCoverage()

  if (!result.success) {
    return NextResponse.error()
  }

  return NextResponse.json(result.data)
}
