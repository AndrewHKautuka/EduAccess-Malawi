import { MalawiMap } from "~/map/components/malawi-map"
import { MapOptionsCard } from "~/map/components/map-options-card"

export default function MapPage() {
  return (
    <div className="flex items-center justify-center">
      <div className="mx-8 mt-8 flex h-full w-full flex-row items-center gap-8">
        <MalawiMap className="border-foreground aspect-video flex-1 border-2" />
        <MapOptionsCard className="h-fit w-[25%] min-w-fit" />
      </div>
    </div>
  )
}
