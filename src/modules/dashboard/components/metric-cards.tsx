import React from "react"

import type { MetricData } from "../types/dashboard-types"

interface MetricCardsProps {
  metrics: MetricData[]
  loading: boolean
  error?: string
}

// MetricCards: Displays a set of metric cards for dashboard KPIs.

export const MetricCards: React.FC<MetricCardsProps> = ({
  metrics,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-muted h-28 animate-pulse rounded p-4"
            aria-hidden
          />
        ))}
      </div>
    )
  }
  if (error) {
    return (
      <div role="alert" className="text-red-500">
        {error}
      </div>
    )
  }
  if (!metrics || metrics.length === 0) {
    return (
      <div className="text-muted-foreground text-center">
        No metrics available.
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="flex flex-col items-center rounded bg-white p-4 shadow"
        >
          <div className="text-lg font-semibold">{metric.label}</div>
          <div className="text-2xl font-bold">
            {metric.value}{" "}
            <span className="text-base font-normal">{metric.unit}</span>
          </div>
          {metric.description && (
            <div className="text-muted-foreground mt-1 text-xs">
              {metric.description}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
