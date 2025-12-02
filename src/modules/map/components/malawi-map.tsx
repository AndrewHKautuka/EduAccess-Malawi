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
  const {
    adminBoundaryLevel,
    educationalFacilitiesChecked,
    populatedPlacesChecked,
    roadsChecked,
  } = useMapOptionsStore()

  const educationalFacilitiesLayer =
    educationalFacilitiesChecked &&
    vectorLayers.find((layer) => layer.layerName === "educational_facilities")

  const populatedPlacesLayer =
    populatedPlacesChecked &&
    vectorLayers.find((layer) => layer.layerName === "populated_places")

  const roadsLayer =
    roadsChecked && vectorLayers.find((layer) => layer.layerName === "roads")

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

  const layersToDisplay = [
    educationalFacilitiesLayer,
    populatedPlacesLayer,
    roadsLayer,
    adminBoundaryLayer,
  ].filter((layer) => !!layer)

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
