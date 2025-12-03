import { LatLngBoundsExpression, LatLngExpression } from "leaflet"

import { AVAILABLE_LAYERS } from "@/shared/constants/layer-constants"

export const MAP_INITIAL_POSITION: LatLngExpression = [-13.25, 34.3]
export const MAP_BOUNDS: LatLngBoundsExpression = [
  [-9.25, 32],
  [-17.5, 36],
]
export const MAP_MIN_ZOOM: number = 7
export const MAP_INITIAL_ZOOM: number = MAP_MIN_ZOOM

export const MAP_RELOAD_LAYER_DEBOUNCE_PERIOD: number = 250

// Layers that should be filtered by bounding box
export const BBOX_FILTERED_LAYERS = new Set<keyof typeof AVAILABLE_LAYERS>([
  "education_facilities",
  "populated_places",
])
