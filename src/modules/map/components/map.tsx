"use client"

import { LatLngBoundsExpression, LatLngExpression } from "leaflet"
import "leaflet-defaulticon-compatibility"
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet"

import { VectorLayer } from "@/shared/types/layer-types"

import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet/dist/leaflet.css"

interface MapProps {
  position: LatLngExpression
  bounds?: LatLngBoundsExpression
  vectorLayers?: VectorLayer[]
  zoom: number
  minZoom?: number
  className?: string
}

export default function Map({
  position,
  bounds,
  vectorLayers = [],
  zoom,
  minZoom,
  className,
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

      {vectorLayers.map((layer) => (
        <GeoJSON
          key={layer.layerName}
          data={layer.data}
          style={(feature) => ({
            color: feature?.geometry.type === "Polygon" ? "purple" : "black",
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.5,
          })}
          onEachFeature={(feature, layer) => {
            if (feature.properties && feature.properties.popupContent) {
              layer.bindPopup(feature.properties.popupContent)
            }
          }}
        />
      ))}
    </MapContainer>
  )
}
