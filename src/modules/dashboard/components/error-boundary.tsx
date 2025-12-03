"use client"

import { ReactNode, useEffect, useState } from "react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true)
      setError(event.error)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setHasError(true)
      setError(
        new Error(event.reason?.message || "Unhandled promise rejection")
      )
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  if (hasError) {
    return (
      <div role="alert" className="rounded border bg-red-50 p-4">
        {fallback ?? (
          <div>
            <div className="font-semibold text-red-700">
              Something went wrong in the dashboard.
            </div>
            <div className="text-muted-foreground text-sm">
              Try refreshing or contact the administrator.
            </div>
            {error && (
              <div className="mt-2 text-xs text-red-600">
                <details className="cursor-pointer">
                  <summary>Error details</summary>
                  <pre className="mt-1 text-xs break-words whitespace-pre-wrap">
                    {error.toString()}
                  </pre>
                </details>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return <>{children}</>
}
