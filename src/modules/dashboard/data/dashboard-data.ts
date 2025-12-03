import type {
  DashboardStatsResponse,
  SubdivisionsResponse,
} from "../types/dashboard-types"

export const DASHBOARD_STATS_URL = "/api/dashboard/stats"
export const SUBDIVISIONS_URL = "/api/dashboard/subdivisions"

export async function fetchDashboardStats(
  params: Record<string, string | number | undefined>
): Promise<DashboardStatsResponse> {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.append(key, String(value))
  })

  const url = `${DASHBOARD_STATS_URL}${query.toString() ? `?${query.toString()}` : ""}`
  const res = await fetch(url)
  if (!res.ok) {
    return {
      status: "error",
      error: `Failed to fetch stats: ${res.statusText}`,
    }
  }
  return res.json()
}

export async function fetchSubdivisions(): Promise<SubdivisionsResponse> {
  const res = await fetch(SUBDIVISIONS_URL)
  if (!res.ok) {
    return {
      status: "error",
      error: `Failed to fetch subdivisions: ${res.statusText}`,
    }
  }
  return res.json()
}
