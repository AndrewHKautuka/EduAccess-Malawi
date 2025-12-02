"use client"

import dynamic from "next/dynamic"

import { VectorLayer } from "@/shared/types/layer-types"

import {
  MAP_BOUNDS,
  MAP_INITIAL_POSITION,
  MAP_INITIAL_ZOOM,
  MAP_MIN_ZOOM,
} from "../constants/malawi-map-constants"
import { useMapOptionsStore } from "../hooks/use-map-options-store"

interface MalawiMapProps {
  vectorLayers: VectorLayer[]
  className?: string
}

const Map = dynamic(() => import("./map"), { ssr: false })

export function MalawiMap({ vectorLayers, className }: MalawiMapProps) {
  const { adminBoundaryLevel } = useMapOptionsStore()

  const malawiLayer = vectorLayers.find((layer) => layer.layerName === "malawi")

  const layersToDisplay = [
    ...(adminBoundaryLevel === "National" && malawiLayer ? [malawiLayer] : []),
  ]

  return (
    <Map
      position={MAP_INITIAL_POSITION}
      bounds={MAP_BOUNDS}
      vectorLayers={layersToDisplay}
      zoom={MAP_INITIAL_ZOOM}
      minZoom={MAP_MIN_ZOOM}
      className={className}
    />
  )
}
