/* eslint-disable drizzle/enforce-delete-with-where */
"use client"

import { useEffect, useRef, useState } from "react"

import dynamic from "next/dynamic"

import { LatLngBounds } from "leaflet"

import { AVAILABLE_LAYERS } from "@/shared/constants/layer-constants"
import { VectorLayer, VectorLayerWithConfig } from "@/shared/types/layer-types"
import { isValidLayer } from "@/shared/utils/layer-utils"

import {
  BBOX_FILTERED_LAYERS,
  MAP_BOUNDS,
  MAP_INITIAL_POSITION,
  MAP_INITIAL_ZOOM,
  MAP_MIN_ZOOM,
  MAP_RELOAD_LAYER_DEBOUNCE_PERIOD,
} from "../constants/malawi-map-constants"
import { useMapOptionsStore } from "../hooks/use-map-options-store"
import { hasBboxChangedSignificantly } from "../utils/map-utils"

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
  } = useMapOptionsStore()

  const validLayers: VectorLayerWithConfig[] = vectorLayers
    .filter((layer) => isValidLayer(layer.layerName))
    .map((layer) => ({
      ...layer,
      config: AVAILABLE_LAYERS[layer.layerName],
    }))
  const [loadedLayers, setLoadedLayers] =
    useState<VectorLayerWithConfig[]>(validLayers)
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null)
  const [layerVersions, setLayerVersions] = useState<
    globalThis.Map<string, number>
  >(new globalThis.Map())
  const loadingRef = useRef<Set<string>>(new Set())
  const layersRef = useRef<VectorLayerWithConfig[]>(validLayers)
  const previousBboxRef = useRef<
    globalThis.Map<string, [number, number, number, number]>
  >(new globalThis.Map())
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const selectedLayers = [
    educationalFacilitiesChecked && "education_facilities",
    populatedPlacesChecked && "populated_places",
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

  // Load layers when selected layers change
  useEffect(() => {
    const loadLayer = async (
      layerName: string,
      bbox?: [number, number, number, number]
    ) => {
      if (loadingRef.current.has(layerName)) {
        return
      }

      // For bbox-filtered layers, check if we need to reload
      if (BBOX_FILTERED_LAYERS.has(layerName)) {
        if (bbox) {
          const previousBbox = previousBboxRef.current.get(layerName)
          // Only reload if bbox changed significantly or layer doesn't exist
          const needsReload =
            !layersRef.current.some((layer) => layer.layerName === layerName) ||
            hasBboxChangedSignificantly(previousBbox, bbox)

          if (!needsReload) {
            return
          }

          // Remove existing layer to reload with new bbox
          layersRef.current = layersRef.current.filter(
            (layer) => layer.layerName !== layerName
          )
          previousBboxRef.current.set(layerName, bbox)
        } else if (
          layersRef.current.some((layer) => layer.layerName === layerName)
        ) {
          return
        }
      } else if (
        layersRef.current.some((layer) => layer.layerName === layerName)
      ) {
        return
      }

      loadingRef.current.add(layerName)

      try {
        let url = `/api/map/layers/${layerName}`
        if (bbox) {
          const [minLng, minLat, maxLng, maxLat] = bbox
          url += `?bbox=${minLng},${minLat},${maxLng},${maxLat}`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to load ${layerName}`)
        }

        const data: VectorLayerWithConfig = await response.json()
        layersRef.current.push(data)
        setLoadedLayers([...layersRef.current])
        // Update version to force Map GeoJSON re-render
        setLayerVersions((prev) => {
          const next = new globalThis.Map(prev)
          next.set(layerName, (next.get(layerName) || 0) + 1)
          return next
        })
      } catch (error) {
        console.error(`Error loading layer ${layerName}:`, error)
      } finally {
        loadingRef.current.delete(layerName)
      }
    }

    selectedLayers.forEach((layerName) => {
      if (isValidLayer(layerName)) {
        const isBboxFiltered = BBOX_FILTERED_LAYERS.has(layerName)
        const shouldUseBbox = isBboxFiltered && mapBounds
        const bbox: [number, number, number, number] | undefined = shouldUseBbox
          ? [
              mapBounds.getWest(),
              mapBounds.getSouth(),
              mapBounds.getEast(),
              mapBounds.getNorth(),
            ]
          : undefined

        // For bbox-filtered layers, wait for bounds to be available
        // For other layers, load normally
        if (isBboxFiltered && !mapBounds) {
          return // Wait for bounds to be available
        }

        if (
          !loadingRef.current.has(layerName) &&
          (shouldUseBbox ||
            !layersRef.current.some((layer) => layer.layerName === layerName))
        ) {
          loadLayer(layerName, bbox)
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLayers])

  // Reload bbox-filtered layers when bounds change significantly
  useEffect(() => {
    if (!mapBounds) return

    // Clear any pending debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Debounce bounds changes by 300ms
    debounceTimeoutRef.current = setTimeout(() => {
      const bboxFilteredSelectedLayers = selectedLayers.filter((layerName) =>
        BBOX_FILTERED_LAYERS.has(layerName)
      )

      bboxFilteredSelectedLayers.forEach((layerName) => {
        if (!isValidLayer(layerName)) return

        const bbox: [number, number, number, number] = [
          mapBounds.getWest(),
          mapBounds.getSouth(),
          mapBounds.getEast(),
          mapBounds.getNorth(),
        ]

        const previousBbox = previousBboxRef.current.get(layerName)

        // Only reload if bounds changed significantly
        if (
          hasBboxChangedSignificantly(previousBbox, bbox) &&
          !loadingRef.current.has(layerName)
        ) {
          // Remove existing layer
          layersRef.current = layersRef.current.filter(
            (layer) => layer.layerName !== layerName
          )
          previousBboxRef.current.set(layerName, bbox)
          setLoadedLayers([...layersRef.current])

          // Load new layer with updated bbox
          loadingRef.current.add(layerName)

          const [minLng, minLat, maxLng, maxLat] = bbox
          const url = `/api/map/layers/${layerName}?bbox=${minLng},${minLat},${maxLng},${maxLat}`

          fetch(url)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to load ${layerName}`)
              }
              return response.json()
            })
            .then((data: VectorLayerWithConfig) => {
              layersRef.current.push(data)
              setLoadedLayers([...layersRef.current])
              // Update version to force GeoJSON re-render
              setLayerVersions((prev) => {
                const next = new globalThis.Map(prev)
                next.set(layerName, (next.get(layerName) || 0) + 1)
                return next
              })
            })
            .catch((error) => {
              console.error(`Error loading layer ${layerName}:`, error)
            })
            .finally(() => {
              loadingRef.current.delete(layerName)
            })
        }
      })
    }, MAP_RELOAD_LAYER_DEBOUNCE_PERIOD)

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [mapBounds, selectedLayers])

  const layersToDisplay: VectorLayerWithConfig[] = selectedLayers
    .filter((layerName) => {
      const layer = loadedLayers.find((layer) => layer.layerName === layerName)
      return layer && isValidLayer(layerName)
    })
    .map((layerName) => {
      const layer = loadedLayers.find((layer) => layer.layerName === layerName)!
      return {
        ...layer,
        config: AVAILABLE_LAYERS[layerName],
      }
    })

  const handleBoundsChange = (bounds: LatLngBounds) => {
    setMapBounds(bounds)
  }

  return (
    <Map
      position={MAP_INITIAL_POSITION}
      bounds={MAP_BOUNDS}
      vectorLayers={layersToDisplay}
      layerVersions={layerVersions}
      zoom={MAP_INITIAL_ZOOM}
      minZoom={MAP_MIN_ZOOM}
      className={className}
      onBoundsChange={handleBoundsChange}
    />
  )
}
