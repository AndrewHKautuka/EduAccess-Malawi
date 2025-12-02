import { MalawiMap } from "~/map/components/malawi-map"
import { MapOptionsCard } from "~/map/components/map-options-card"
import { getAllVectorLayers } from "~/map/data/map-data"

import { VectorLayer } from "@/shared/types/layer-types"

export default async function MapPage() {
  const result = await getAllVectorLayers()

  if (!result.success) {
    return (
      <div className="text-red-600">
        {result.error.message}
        <br />
        {result.message}
      </div>
    )
  }

  const vectorLayers: VectorLayer[] = result.data

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
