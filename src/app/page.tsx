import Link from "next/link"

export default function HomePage() {
  return (
    <div className="space-y-8 py-16 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Malawi School Accessibility & Education Planning Tool
        </h1>
        <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
          Analyze school coverage, identify underserved communities, and plan
          education infrastructure using spatial data.
        </p>
      </div>

      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700"
        >
          View Dashboard
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Explore Features
        </Link>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 pt-12 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">School Coverage</h3>
          <p className="text-muted-foreground">
            Visualize education facilities and populated places across Malawi.
          </p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">Accessibility Analysis</h3>
          <p className="text-muted-foreground">
            Analyze distances and identify underserved communities.
          </p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">Statistics Dashboard</h3>
          <p className="text-muted-foreground">
            View school counts, average distances, and coverage metrics.
          </p>
        </div>
      </div>
    </div>
  )
}
