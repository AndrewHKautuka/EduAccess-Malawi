import {
  districts,
  districtSubdivisions,
  educationFacilities,
  malawi,
  populatedPlaces,
  regions,
} from "@/lib/db/schema"

import { VectorLayerConfig } from "../types/layer-types"

export const AVAILABLE_LAYERS: Record<string, VectorLayerConfig> = {
  malawi: {
    table: malawi,
    idColumn: malawi.id,
    geometryColumn: malawi.geom,
    defaultStyle: {
      color: "#3388ff",
      weight: 2,
      fillOpacity: 0,
    },
  },
  regions: {
    table: regions,
    idColumn: regions.id,
    geometryColumn: regions.geom,
    defaultStyle: {
      color: "#ff7800",
      weight: 2,
      opacity: 0.8,
      fillColor: "#ff7800",
      fillOpacity: 0.2,
    },
  },
  districts: {
    table: districts,
    idColumn: districts.id,
    geometryColumn: districts.geom,
    defaultStyle: {
      color: "#ff7800",
      weight: 2,
      opacity: 0.8,
      fillColor: "#ff7800",
      fillOpacity: 0.2,
    },
  },
  district_subdivisions: {
    table: districtSubdivisions,
    idColumn: districtSubdivisions.id,
    geometryColumn: districtSubdivisions.geom,
    defaultStyle: {
      color: "#ff7800",
      weight: 2,
      opacity: 0.8,
      fillColor: "#ff7800",
      fillOpacity: 0.2,
    },
  },
  education_facilities: {
    table: educationFacilities,
    idColumn: educationFacilities.id,
    geometryColumn: educationFacilities.geom,
    defaultStyle: {
      color: "#555555",
      weight: 3,
      opacity: 0.7,
    },
  },
  populated_places: {
    table: populatedPlaces,
    idColumn: populatedPlaces.id,
    geometryColumn: populatedPlaces.geom,
    defaultStyle: {
      color: "#555555",
      weight: 3,
      opacity: 0.7,
    },
  },
}
