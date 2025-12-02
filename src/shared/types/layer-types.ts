export interface GeoJSONFeature {
  type: "Feature"
  id: string | number
  geometry: {
    type: string
    coordinates: unknown
  }
  properties: Record<string, unknown>
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection"
  features: GeoJSONFeature[]
}

export interface VectorLayer {
  layerName: string
  data: GeoJSONFeatureCollection
}
