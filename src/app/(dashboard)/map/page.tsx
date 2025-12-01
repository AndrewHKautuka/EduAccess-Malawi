import { MalawiMap } from "~/map/components/malawi-map"

export default async function MapPage() {
  return (
    <div className="flex items-center justify-center">
      <div className="mx-16 flex h-full w-full flex-row gap-8">
        <MalawiMap className="border-foreground aspect-video w-full border-2" />
      </div>
    </div>
  )
}
