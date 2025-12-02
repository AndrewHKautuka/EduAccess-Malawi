import { MalawiMap } from "~/map/components/malawi-map"
import { MapOptionsCard } from "~/map/components/map-options-card"
import { getAllAdminBoundaryLayers, getVectorLayer } from "~/map/data/map-data"

import { VectorLayer } from "@/shared/types/layer-types"

export default async function MapPage() {
  const adminBoundaryResult = await getAllAdminBoundaryLayers()

  if (!adminBoundaryResult.success) {
    return (
      <div className="text-red-600">
        {adminBoundaryResult.error.message}
        <br />
        {adminBoundaryResult.message}
      </div>
    )
  }

  const educationFacilitiesResult = await getVectorLayer("education_facilities")

  if (!educationFacilitiesResult.success) {
    return (
      <div className="text-red-600">
        {educationFacilitiesResult.error.message}
        <br />
        {educationFacilitiesResult.message}
      </div>
    )
  }

  const populatedPlacesResult = await getVectorLayer("populated_places")

  if (!populatedPlacesResult.success) {
    return (
      <div className="text-red-600">
        {populatedPlacesResult.error.message}
        <br />
        {populatedPlacesResult.message}
      </div>
    )
  }

  const vectorLayers: VectorLayer[] = [
    ...adminBoundaryResult.data,
    educationFacilitiesResult.data,
    populatedPlacesResult.data,
  ]

  return (
    <div className="flex items-center justify-center">
      <div className="mx-8 mt-8 flex h-full w-full flex-row items-center gap-8">
        <MalawiMap
          vectorLayers={vectorLayers}
          className="border-foreground aspect-video flex-1 border-2"
        />
        <MapOptionsCard className="h-fit w-[25%] min-w-fit" />
      </div>
    </div>
  )
}
