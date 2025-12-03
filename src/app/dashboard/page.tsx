import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { DashboardStats } from "@/modules/dashboard/components/dashboard-stats"
import { ErrorBoundary } from "@/modules/dashboard/components/error-boundary"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Statistics Dashboard
        </h1>
        <p className="text-muted-foreground">
          View education statistics, school coverage, and accessibility metrics
          across Malawi.
        </p>
      </div>

      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
              </div>
              <Skeleton className="h-64 w-full" />
            </div>
          }
        >
          {/* DashboardStats expects props in our components; here we render in loading state.
              Actual data will be loaded by the hook inside the component. */}
          <DashboardStats loading={false} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
