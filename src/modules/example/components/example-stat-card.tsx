"use client"

import { useId } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

import { ExampleStat } from "../types/example-types"

interface ExampleStatCardProps {
  stat: ExampleStat
  className?: string
}

export function ExampleStatCard({ stat, className }: ExampleStatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 justify-between md:grid-cols-4">
          <InfoRow label="Served" value={stat.served.toString()} />
          <InfoRow label="Total" value={stat.total.toString()} />
        </div>

        <Coverage coveragePercentage={stat.coveragePercentage} />
      </CardContent>
    </Card>
  )
}

interface InfoRowProps {
  label: string
  value: string
}

function InfoRow({ label, value }: InfoRowProps) {
  const infoId = useId()

  return (
    <>
      <Label htmlFor={infoId} className="text-foreground font-semibold">
        {label}:
      </Label>

      <span id={infoId} className="text-muted-foreground italic">
        {value}
      </span>
    </>
  )
}

interface CoverageProps {
  coveragePercentage: number
}

function Coverage({ coveragePercentage }: CoverageProps) {
  const id = useId()

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor={id} className="text-foreground font-semibold">
        Coverage:
      </Label>

      <Progress value={coveragePercentage} max={100} />
    </div>
  )
}
