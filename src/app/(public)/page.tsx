import Link from "next/link"

import { ExampleCardList } from "~/example/components/example-card-list"
import { ExampleStatCard } from "~/example/components/example-stat-card"
import {
  getExampleCoverage,
  getExampleItems,
} from "~/example/data/example-data"

import { Button } from "@/components/ui/button"

export default async function LandingPage() {
  const itemsResult = await getExampleItems()
  const coverageResult = await getExampleCoverage()

  if (!itemsResult.success || !coverageResult.success) {
    return null
  }

  const items = itemsResult.data
  const stat = coverageResult.data

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-3xl space-y-6 text-center">
        <h1 className="tracking-tight">Malawi School Accessibility Tool</h1>

        <p className="text-muted-foreground text-lg">
          Analyze school coverage and identify underserved communities using
          spatial data.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button variant="default" asChild>
            <Link href="#">Get Started</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/map">Continue</Link>
          </Button>
        </div>

        <ExampleStatCard stat={stat} />
        <ExampleCardList items={items} />
      </div>
    </div>
  )
}
