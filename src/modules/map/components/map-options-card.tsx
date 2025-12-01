"use client"

import { useId, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { ADMIN_BOUNDARY_LEVELS } from "../constants/map-constants"
import { AdminBoundaryLevel } from "../types/map-types"

interface MapOptionsCardProps {
  className?: string
}

export function MapOptionsCard({ className }: MapOptionsCardProps) {
  return (
    <Card className={cn("gap-2", className)}>
      <CardHeader>
        <CardTitle className="text-xl">Map Options</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <LayerToggles />

        <OptionsSection title="Admin Boundary Level">
          <AdminBoundarySelect initialLevel="National" />
        </OptionsSection>
      </CardContent>
    </Card>
  )
}

interface OptionsSectionProps {
  title: string
  children: React.ReactNode
}

function OptionsSection({ title, children }: OptionsSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <h6 className="mb-1">{title}</h6>
      {children}
    </div>
  )
}

function LayerToggles() {
  return (
    <OptionsSection title="Vector Layer Toggles">
      <LayerToggle layerLabel="Educational Facilities" />
      <LayerToggle layerLabel="Populated Places" />
      <LayerToggle layerLabel="Roads" />
    </OptionsSection>
  )
}

interface LayerToggleProps {
  layerLabel: string
}

function LayerToggle({ layerLabel }: LayerToggleProps) {
  const id = useId()

  return (
    <div className="flex items-center gap-3">
      <Checkbox id={id} />
      <Label htmlFor={id}>{layerLabel}</Label>
    </div>
  )
}

interface AdminSelectProps {
  initialLevel: AdminBoundaryLevel
}

function AdminBoundarySelect({ initialLevel }: AdminSelectProps) {
  const [adminBoundaryLevel, setAdminBoundaryLevel] = useState(initialLevel)

  return (
    <Select
      value={adminBoundaryLevel}
      onValueChange={(value) =>
        setAdminBoundaryLevel(value as AdminBoundaryLevel)
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Admin Boundary" />
      </SelectTrigger>
      <SelectContent>
        {ADMIN_BOUNDARY_LEVELS.map((adminBoundaryLevel) => (
          <SelectItem key={adminBoundaryLevel} value={adminBoundaryLevel}>
            {adminBoundaryLevel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
