import type { ChartSeries, SubdivisionData } from "../types/dashboard-types"

export function metersToKm(meters: number): string {
  return (meters / 1000).toFixed(2)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function subdivisionsToChartSeries(
  subdivisions: SubdivisionData[]
): ChartSeries[] {
  return subdivisions.map((sub) => ({
    id: sub.id,
    label: sub.name,
    data: [sub.schools, sub.population],
  }))
}

export function schoolPopulationRatio(
  schools: number,
  population: number
): number {
  return population === 0 ? 0 : schools / population
}
