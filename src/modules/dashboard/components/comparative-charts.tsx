import React from "react"

import type { ChartSeries } from "../types/dashboard-types"

interface ComparativeChartsProps {
  data: ChartSeries[]
  loading?: boolean
}

/**
 * ComparativeCharts: Renders comparative bar charts for dashboard data.
 */
export const ComparativeCharts: React.FC<ComparativeChartsProps> = ({
  data,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-muted h-64 w-full animate-pulse rounded" aria-hidden />
    )
  }
  if (!data || data.length === 0) {
    return (
      <div className="text-muted-foreground text-center">
        No data available for charts.
      </div>
    )
  }
  // Placeholder for chart library integration (e.g., recharts, chart.js)
  return (
    <div className="bg-muted flex h-64 w-full items-center justify-center rounded">
      <span className="text-muted-foreground">[Chart will render here]</span>
    </div>
  )
}
