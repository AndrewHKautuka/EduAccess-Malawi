import { MalawiMap } from "~/map/components/malawi-map"
import { MapOptionsCard } from "~/map/components/map-options-card"
import { getMalawiLayer } from "~/map/data/map-data"

import { VectorLayer } from "@/shared/types/layer-types"

export default async function MapPage() {
  console.log("Fetching Malawi Layer")

  const malawiLayerResult = await getMalawiLayer()

  if (!malawiLayerResult.success) {
    console.error("Failed to fetch Malawi Layer")
    return (
      <div className="text-red-600">
        {malawiLayerResult.error.message}
        <br />
        {malawiLayerResult.message}
      </div>
    )
  }

  const vectorLayers: VectorLayer[] = [malawiLayerResult.data]

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
