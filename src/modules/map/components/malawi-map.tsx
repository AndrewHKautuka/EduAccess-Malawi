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

  const adminBoundaryLayer = vectorLayers.find((layer) => {
    switch (adminBoundaryLevel) {
      case "National": {
        return layer.layerName === "malawi"
      }
      case "Regional": {
        return layer.layerName === "regions"
      }
      case "District": {
        return layer.layerName === "districts"
      }
      case "Sub-district": {
        return layer.layerName === "district_subdivisions"
      }
    }
  })

  const layersToDisplay = [...(adminBoundaryLayer ? [adminBoundaryLayer] : [])]

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
