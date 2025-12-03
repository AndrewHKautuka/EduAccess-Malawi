import React from "react"

import { ComparativeCharts } from "~/dashboard"

import type { DashboardStats } from "../types/dashboard-types"
import { MetricCards } from "./metric-cards"

interface DashboardStatsProps {
  stats?: DashboardStats
  loading: boolean
  error?: string
}

export const DashboardStatsComponent: React.FC<DashboardStatsProps> = ({
  stats,
  loading,
  error,
}) => {
  return (
    <section className="space-y-6">
      <MetricCards
        metrics={stats?.metrics ?? []}
        loading={loading}
        error={error}
      />
      <ComparativeCharts
        data={
          stats
            ? stats.subdivisions.map((sub) => ({
                id: sub.id,
                label: sub.name,
                data: [sub.schools, sub.population],
              }))
            : []
        }
        loading={loading}
      />
      {error && (
        <div role="alert" className="text-red-500">
          {error}
        </div>
      )}
    </section>
  )
}

export { DashboardStatsComponent as DashboardStats }
//DashboardStats: Main dashboard container, composes MetricCards and ComparativeCharts.
// Export original name for backwards compatibility inside module scope
