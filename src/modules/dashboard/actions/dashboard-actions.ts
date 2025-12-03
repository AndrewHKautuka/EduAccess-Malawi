import type { DashboardStatsResponse } from "../types/dashboard-types"
import { dashboardFiltersSchema } from "../validations/dashboard-validations"

export class DashboardActionError extends Error {
  public code: number
  public details?: unknown
  constructor(message: string, code = 400, details?: unknown) {
    super(message)
    this.name = "DashboardActionError"
    this.code = code
    this.details = details
  }
}

export async function getDashboardStats(
  input: unknown
): Promise<DashboardStatsResponse> {
  const result = dashboardFiltersSchema.safeParse(input)
  if (!result.success) {
    // Include Zod issues in details for easier debugging on the server
    throw new DashboardActionError(
      "Invalid parameters",
      400,
      result.error.format()
    )
  }

  throw new DashboardActionError(
    "getDashboardStats is not implemented on the frontend. Implement on server.",
    501
  )
}
