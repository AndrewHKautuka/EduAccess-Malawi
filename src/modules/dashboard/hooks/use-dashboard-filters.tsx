"use client"
import { useCallback, useEffect } from "react"

import type { DashboardFiltersInput } from "~/dashboard/validations/dashboard-validations"
import { dashboardFiltersSchema } from "~/dashboard/validations/dashboard-validations"

import { useDashboardFiltersStore } from "../store/dashboard-filters-store"

export function useDashboardFilters() {
  const { filters, setFilters: setStoreFilters } = useDashboardFiltersStore()

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const raw = Object.fromEntries(params.entries())

      const asTyped = {
        ...raw,
        radiusMeters: raw.radiusMeters ? Number(raw.radiusMeters) : undefined,
      }
      const parsed = dashboardFiltersSchema.safeParse(asTyped)
      if (parsed.success) setStoreFilters(parsed.data)
    } catch (err) {}
  }, [setStoreFilters])

  const setFilters = useCallback(
    (next: DashboardFiltersInput) => {
      const parsed = dashboardFiltersSchema.safeParse(next)
      if (!parsed.success) {
        return
      }

      setStoreFilters(parsed.data)

      const params = new URLSearchParams()
      if (parsed.data.subdivisionId)
        params.set("subdivisionId", parsed.data.subdivisionId)
      if (parsed.data.radiusMeters !== undefined)
        params.set("radiusMeters", String(parsed.data.radiusMeters))
      const qs = params.toString()
      const newUrl = qs ? `?${qs}` : window.location.pathname
      window.history.replaceState({}, "", newUrl)
    },
    [setStoreFilters]
  )

  return { filters, setFilters }
}
