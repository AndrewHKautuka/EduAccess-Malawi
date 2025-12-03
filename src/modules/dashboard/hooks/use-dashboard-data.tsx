import { useCallback } from "react"

import { useQuery } from "@tanstack/react-query"

import { fetchDashboardStats } from "../data/dashboard-data"
import type { DashboardStatsResponse } from "../types/dashboard-types"

export function useDashboardData(filters: {
  subdivisionId?: string
  radiusMeters?: number
}) {
  const queryKey = ["dashboard-stats", filters]

  const queryFn = useCallback(async (): Promise<DashboardStatsResponse> => {
    const params: Record<string, string | number | undefined> = {}
    if (filters.subdivisionId) params.subdivisionId = filters.subdivisionId
    if (filters.radiusMeters) params.radiusMeters = filters.radiusMeters
    const res = await fetchDashboardStats(params)

    if (res.status === "error") {
      throw new Error(res.error ?? "Unknown dashboard fetch error")
    }
    return res
  }, [filters])

  return useQuery({
    queryKey,
    queryFn,
    staleTime: 60_000,
    cacheTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30_000),
  })
}
