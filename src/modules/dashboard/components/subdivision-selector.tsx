import React from "react"

import type { SubdivisionData } from "../types/dashboard-types"

interface SubdivisionSelectorProps {
  subdivisions: SubdivisionData[]
  selectedId?: string
  onSubdivisionChange: (id: string) => void
  loading: boolean
}
// SubdivisionSelector: Dropdown for selecting administrative subdivision.

export const SubdivisionSelector: React.FC<SubdivisionSelectorProps> = ({
  subdivisions,
  selectedId,
  onSubdivisionChange,
  loading,
}) => (
  <div className="flex flex-col gap-2">
    <label htmlFor="subdivision-select" className="font-medium">
      Subdivision
    </label>
    <select
      id="subdivision-select"
      className="input"
      value={selectedId || ""}
      onChange={(e) => onSubdivisionChange(e.target.value)}
      disabled={loading}
    >
      <option value="" disabled>
        Select a subdivision
      </option>
      {subdivisions.map((sub) => (
        <option key={sub.id} value={sub.id}>
          {sub.name}
        </option>
      ))}
    </select>
    {loading && (
      <div className="text-muted-foreground animate-pulse text-xs">
        Loading subdivisions...
      </div>
    )}
  </div>
)
