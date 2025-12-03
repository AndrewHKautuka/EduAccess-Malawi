"use client"

import { useEffect, useRef } from "react"

import { LatLngBounds, LatLngBoundsExpression, LatLngExpression } from "leaflet"
import "leaflet-defaulticon-compatibility"
import { GeoJSON, MapContainer, TileLayer, useMapEvents } from "react-leaflet"

import { VectorLayerWithConfig } from "@/shared/types/layer-types"

import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet/dist/leaflet.css"

interface MapProps {
  position: LatLngExpression
  bounds?: LatLngBoundsExpression
  vectorLayers?: VectorLayerWithConfig[]
  layerVersions?: globalThis.Map<string, number>
  zoom: number
  minZoom?: number
  className?: string
  onBoundsChange?: (bounds: LatLngBounds) => void
}

function MapBoundsTracker({
  onBoundsChange,
}: {
  onBoundsChange: (bounds: LatLngBounds) => void
}) {
  const onBoundsChangeRef = useRef(onBoundsChange)
  const initializedRef = useRef(false)

  // Keep ref updated
  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange
  }, [onBoundsChange])

  const map = useMapEvents({
    moveend: () => onBoundsChangeRef.current(map.getBounds()),
    zoomend: () => onBoundsChangeRef.current(map.getBounds()),
  })

  // Initialize bounds once when map is ready
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      onBoundsChangeRef.current(map.getBounds())
    }
  }, [map])

  return null
}

export default function Map({
  position,
  bounds,
  vectorLayers = [],
  layerVersions,
  zoom,
  minZoom,
  className,
  onBoundsChange,
}: MapProps) {
  return (
    <MapContainer
      center={position}
      maxBounds={bounds}
      zoom={zoom}
      minZoom={minZoom}
      className={className}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {onBoundsChange && <MapBoundsTracker onBoundsChange={onBoundsChange} />}

      {vectorLayers.map((layer) => {
        const version = layerVersions?.get(layer.layerName) || 0
        return (
          <GeoJSON
            key={`${layer.layerName}-${version}`}
            data={layer.data}
            style={() => layer.config.defaultStyle}
          />
        )
      })}
    </MapContainer>
  )
}
