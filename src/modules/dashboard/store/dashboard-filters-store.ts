import { create } from "zustand"

import type { DashboardFilters } from "../types/dashboard-types"

interface DashboardFiltersState {
  filters: DashboardFilters
  setFilters: (filters: DashboardFilters) => void
}

export const useDashboardFiltersStore = create<DashboardFiltersState>(
  (set) => ({
    filters: {},
    setFilters: (filters) => set({ filters }),
  })
)
