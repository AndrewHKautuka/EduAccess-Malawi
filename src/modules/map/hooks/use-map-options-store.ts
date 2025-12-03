"use client"

import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

import { AdminBoundaryLevel } from "../types/map-types"

interface MapOptionsState {
  educationalFacilitiesChecked: boolean
  populatedPlacesChecked: boolean
  adminBoundaryLevel: AdminBoundaryLevel
  setEducationalFacilitiesChecked: (checked: boolean) => void
  setPopulatedPlacesChecked: (checked: boolean) => void
  setAdminBoundaryLevel: (level: AdminBoundaryLevel) => void
}

export const useMapOptionsStore = create<MapOptionsState>()(
  devtools(
    persist(
      (set) => ({
        educationalFacilitiesChecked: true,
        populatedPlacesChecked: true,
        adminBoundaryLevel: "District",
        setEducationalFacilitiesChecked: (checked: boolean) =>
          set({ educationalFacilitiesChecked: checked }),
        setPopulatedPlacesChecked: (checked: boolean) =>
          set({ populatedPlacesChecked: checked }),
        setAdminBoundaryLevel: (level: AdminBoundaryLevel) =>
          set({ adminBoundaryLevel: level }),
      }),
      {
        name: "map-options",
      }
    ),
    {
      name: "MapOptions",
    }
  )
)
