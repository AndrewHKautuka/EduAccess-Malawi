/* eslint-disable drizzle/enforce-delete-with-where */
"use client"

import { useEffect, useRef, useState } from "react"

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
  vectorLayers?: VectorLayer[]
  className?: string
}

const Map = dynamic(() => import("./map"), { ssr: false })

export function MalawiMap({ vectorLayers = [], className }: MalawiMapProps) {
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
  const [loadedLayers, setLoadedLayers] =
    useState<VectorLayerWithConfig[]>(validLayers)
  const loadingRef = useRef<Set<string>>(new Set())
  const layersRef = useRef<VectorLayerWithConfig[]>(validLayers)

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

  useEffect(() => {
    const loadLayer = async (layerName: string) => {
      if (
        loadingRef.current.has(layerName) ||
        layersRef.current.some((layer) => layer.layerName === layerName)
      ) {
        return
      }

      loadingRef.current.add(layerName)

      try {
        const response = await fetch(`/api/map/layers/${layerName}`)

        if (!response.ok) {
          throw new Error(`Failed to load ${layerName}`)
        }

        const data: VectorLayerWithConfig = await response.json()
        layersRef.current.push(data)
        setLoadedLayers([...layersRef.current])
      } catch (error) {
        console.error(`Error loading layer ${layerName}:`, error)
      } finally {
        loadingRef.current.delete(layerName)
      }
    }

    selectedLayers.forEach((layerName) => {
      if (isValidLayer(layerName)) {
        if (
          !layersRef.current.some((layer) => layer.layerName === layerName) &&
          !loadingRef.current.has(layerName)
        ) {
          loadLayer(layerName)
        }
      }
    })
  }, [selectedLayers])

  const layersToDisplay: VectorLayerWithConfig[] = (() => {
    return selectedLayers
      .filter((layerName) => {
        const layer = loadedLayers.find(
          (layer) => layer.layerName === layerName
        )
        return layer && isValidLayer(layerName)
      })
      .map((layerName) => {
        const layer = loadedLayers.find(
          (layer) => layer.layerName === layerName
        )!
        return {
          ...layer,
          config: AVAILABLE_LAYERS[layerName],
        }
      })
  })()

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
