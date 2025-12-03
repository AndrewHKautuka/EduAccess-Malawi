import { PgColumn } from "drizzle-orm/pg-core"

import { DatabaseQueryable } from "@/types/db-types"

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

export interface VectorLayerConfig {
  table: DatabaseQueryable
  idColumn: PgColumn
  geometryColumn: PgColumn
  defaultStyle: {
    color?: string
    weight?: number
    opacity?: number
    fillColor?: string
    fillOpacity?: number
    radius?: number
  }
}

export interface VectorLayerWithConfig extends VectorLayer {
  config: VectorLayerConfig
}
