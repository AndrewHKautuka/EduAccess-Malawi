"use client"

import { LatLngBoundsExpression, LatLngExpression } from "leaflet"
import "leaflet-defaulticon-compatibility"
import { MapContainer, TileLayer } from "react-leaflet"

import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet/dist/leaflet.css"

interface MapProps {
  position: LatLngExpression
  bounds?: LatLngBoundsExpression
  zoom: number
  minZoom?: number
  className?: string
}

export default function Map({
  position,
  bounds,
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
    </MapContainer>
  )
}
