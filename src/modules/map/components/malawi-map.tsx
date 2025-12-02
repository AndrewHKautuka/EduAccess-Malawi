"use client"

import dynamic from "next/dynamic"

import { AVAILABLE_LAYERS } from "@/shared/constants/layer-constants"
import { VectorLayer, VectorLayerWithConfig } from "@/shared/types/layer-types"
import { isValidLayer } from "@/shared/utils/layer-utils"

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
  const {
    adminBoundaryLevel,
    educationalFacilitiesChecked,
    populatedPlacesChecked,
    roadsChecked,
  } = useMapOptionsStore()

  const validLayers: VectorLayerWithConfig[] = vectorLayers
    .filter((layer) => isValidLayer(layer.layerName))
    .map((layer) => ({
      ...layer,
      config: AVAILABLE_LAYERS[layer.layerName],
    }))

  const selectedLayers = [
    educationalFacilitiesChecked && "education_facilities",
    populatedPlacesChecked && "populated_places",
    roadsChecked && "roads",
    (() => {
      switch (adminBoundaryLevel) {
        case "National":
          return "malawi"
        case "Regional":
          return "regions"
        case "District":
          return "districts"
        case "Sub-district":
          return "district_subdivisions"
      }
    })(),
  ].filter((layer) => !!layer) as string[]

  const layersToDisplay = validLayers.filter((layer) =>
    selectedLayers.includes(layer.layerName)
  )

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
