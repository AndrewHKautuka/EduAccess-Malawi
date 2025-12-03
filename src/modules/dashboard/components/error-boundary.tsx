import React from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error | null
}

//Simple ErrorBoundary usable in the dashboard to show a fallback UI.
//This keeps heavy rendering failures isolated from the rest of the app.

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: unknown) {}

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="rounded border bg-red-50 p-4">
          {this.props.fallback ?? (
            <div>
              <div className="font-semibold text-red-700">
                Something went wrong in the dashboard.
              </div>
              <div className="text-muted-foreground text-sm">
                Try refreshing or contact the administrator.
              </div>
            </div>
          )}
        </div>
      )
    }
    return this.props.children as React.ReactElement
  }
}
