import dynamic from "next/dynamic"

import {
  MAP_BOUNDS,
  MAP_INITIAL_POSITION,
  MAP_INITIAL_ZOOM,
  MAP_MIN_ZOOM,
} from "../constants/malawi-map-constants"

interface MalawiMapProps {
  className?: string
}

export function MalawiMap({ className }: MalawiMapProps) {
  const Map = dynamic(() => import("./map"))

  return (
    <Map
      position={MAP_INITIAL_POSITION}
      bounds={MAP_BOUNDS}
      zoom={MAP_INITIAL_ZOOM}
      minZoom={MAP_MIN_ZOOM}
      className={className}
    />
  )
}
