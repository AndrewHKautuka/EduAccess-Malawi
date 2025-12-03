import { NextResponse } from "next/server"

import { ZodError } from "zod"

export function jsonOk(data: unknown, status = 200) {
  return NextResponse.json({ status: "success", data }, { status })
}

export function jsonError(message: string, status = 500, details?: unknown) {
  return NextResponse.json(
    { status: "error", error: message, details },
    { status }
  )
}

export function handleError(e: unknown) {
  if (e instanceof ZodError) {
    return jsonError("Invalid parameters", 400, e.format())
  }
  const err = e as Error
  return jsonError(err.message || "Internal server error", 500)
}
