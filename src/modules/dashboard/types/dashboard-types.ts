export interface GeoJsonGeometry {
  type:
    | "Point"
    | "LineString"
    | "Polygon"
    | "MultiPoint"
    | "MultiLineString"
    | "MultiPolygon"
  coordinates: number[] | number[][] | number[][][]
}

export interface GeoJsonFeature<P = Record<string, unknown>> {
  type: "Feature"
  geometry: GeoJsonGeometry
  properties: P
}

export interface GeoJsonFeatureCollection<F = GeoJsonFeature> {
  type: "FeatureCollection"
  features: F[]
}

export interface MetricData {
  id: string
  label: string
  value: number
  unit: string
  description?: string
}

export interface SubdivisionData {
  id: string
  name: string
  population: number
  schools: number
  areaSqKm: number
  geometry: GeoJsonFeature
}

export interface DashboardStats {
  totalSchools: number
  averageDistance: number
  schoolPopulationRatio: number
  coveragePercentage: number
  lastUpdated: string
  subdivisions: SubdivisionData[]
  metrics: MetricData[]
}

export interface ChartSeries {
  id: string
  label: string
  data: number[]
  color?: string
}

export interface DashboardStatsResponse {
  status: "success" | "error"
  data?: DashboardStats
  error?: string
}

export interface SubdivisionsResponse {
  status: "success" | "error"
  data?: SubdivisionData[]
  error?: string
}

export interface DashboardFilters {
  subdivisionId?: string
  radiusMeters?: number
}
