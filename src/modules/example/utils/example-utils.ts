export function coveragePercentage(total: number, served: number): number {
  if (!Number.isFinite(total) || !Number.isFinite(served)) {
    throw new Error("Inputs must be finite numbers")
  }

  if (total <= 0) return 0

  const pct = (served / total) * 100
  const clamped = Math.min(100, Math.max(0, pct))

  return Math.round(clamped * 100) / 100
}
