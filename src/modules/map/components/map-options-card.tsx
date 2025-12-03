"use client"

import { useId } from "react"

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
import { useMapOptionsStore } from "../hooks/use-map-options-store"
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
        <AdminBoundarySelect />
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
  const {
    educationalFacilitiesChecked,
    setEducationalFacilitiesChecked,
    populatedPlacesChecked,
    setPopulatedPlacesChecked,
  } = useMapOptionsStore()

  return (
    <OptionsSection title="Vector Layer Toggles">
      <LayerToggle
        layerLabel="Educational Facilities"
        checked={educationalFacilitiesChecked}
        setChecked={setEducationalFacilitiesChecked}
      />
      <LayerToggle
        layerLabel="Populated Places"
        checked={populatedPlacesChecked}
        setChecked={setPopulatedPlacesChecked}
      />
    </OptionsSection>
  )
}

interface LayerToggleProps {
  layerLabel: string
  checked: boolean
  setChecked: (checked: boolean) => void
}

function LayerToggle({ layerLabel, checked, setChecked }: LayerToggleProps) {
  const id = useId()

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => setChecked(checked === true)}
      />
      <Label htmlFor={id}>{layerLabel}</Label>
    </div>
  )
}

function AdminBoundarySelect() {
  const { adminBoundaryLevel, setAdminBoundaryLevel } = useMapOptionsStore()

  return (
    <OptionsSection title="Admin Boundary Level">
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
    </OptionsSection>
  )
}
