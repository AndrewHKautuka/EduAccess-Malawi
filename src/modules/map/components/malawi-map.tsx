import dynamic from "next/dynamic"

interface MalawiMapProps {
  className?: string
}

export function MalawiMap({ className }: MalawiMapProps) {
  const Map = dynamic(() => import("./map"))

  return (
    <Map
      position={[-13.25, 34.3]}
      bounds={[
        [-9.25, 32],
        [-17.5, 36],
      ]}
      zoom={7}
      minZoom={7}
      className={className}
    />
  )
}
