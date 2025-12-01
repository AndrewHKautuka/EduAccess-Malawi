import { MalawiMap } from "~/map/components/malawi-map"

export default async function MapPage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <MalawiMap className="border-foreground mx-16 aspect-video w-full border-2" />
    </div>
  )
}
