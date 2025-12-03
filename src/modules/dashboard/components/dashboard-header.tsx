import React from "react"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  lastUpdated?: string | undefined
  onRefresh: () => void
  loading: boolean
}

//DashboardHeader: Displays dashboard title, subtitle, last updated, and refresh button.

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  lastUpdated,
  onRefresh,
  loading,
}) => (
  <header className="mb-6 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      <button
        className="btn btn-outline"
        onClick={onRefresh}
        disabled={loading}
        aria-label="Refresh dashboard"
      >
        {loading ? "Refreshing..." : "Refresh"}
      </button>
    </div>
    <div className="text-muted-foreground text-xs">
      Last updated:{" "}
      {loading ? (
        <span className="animate-pulse">...</span>
      ) : lastUpdated ? (
        new Date(lastUpdated).toLocaleString()
      ) : (
        <span>N/A</span>
      )}
    </div>
  </header>
)
