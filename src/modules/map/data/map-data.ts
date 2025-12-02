"use server"

import { SQL, sql, Subquery } from "drizzle-orm"
import { PgColumn, PgTable } from "drizzle-orm/pg-core"
import { PgViewBase } from "drizzle-orm/pg-core/view-base"

import { drizzle } from "@/lib/db/drizzle"
import {
  districts,
  districtSubdivisions,
  malawi,
  regions,
} from "@/lib/db/schema"
import {
  GeoJSONFeature,
  GeoJSONFeatureCollection,
  VectorLayer,
} from "@/shared/types/layer-types"
import { DataResult } from "@/shared/types/server-action-types"

export async function getAllVectorLayers(): DataResult<VectorLayer[]> {
  const results = await Promise.all([getAllAdminBoundaryLayers()])

  let success = true
  const layers: VectorLayer[] = []
  const errors: (Error | null)[] = []
  const messages: (string | undefined)[] = []
  results.forEach((result) => {
    if (!result.success) {
      success = false
      errors.push(result.error)
    } else {
      layers.push(...result.data)
      errors.push(null)
    }
    messages.push(result.message)
  })

  if (success) {
    return {
      success: true,
      data: layers,
      message: JSON.stringify(messages),
    }
  } else {
    return {
      success: false,
      error: errors.find((error) => error != null)!,
      message: JSON.stringify(messages),
    }
  }
}

export async function getAllAdminBoundaryLayers(): DataResult<VectorLayer[]> {
  const results = await Promise.all([
    getMalawiLayer(),
    getVectorLayer("regions", regions, regions.id, regions.geom),
    getVectorLayer("districts", districts, districts.id, districts.geom),
    getVectorLayer(
      "district_subdivisions",
      districtSubdivisions,
      districtSubdivisions.id,
      districtSubdivisions.geom
    ),
  ])

  let success = true
  const layers: VectorLayer[] = []
  const errors: (Error | null)[] = []
  const messages: (string | undefined)[] = []
  results.forEach((result) => {
    if (!result.success) {
      success = false
      errors.push(result.error)
    } else {
      layers.push(result.data)
      errors.push(null)
    }
    messages.push(result.message)
  })

  if (success) {
    return {
      success: true,
      data: layers,
      message: JSON.stringify(messages),
    }
  } else {
    return {
      success: false,
      error: errors.find((error) => error != null)!,
      message: JSON.stringify(messages),
    }
  }
}

export async function getMalawiLayer(): DataResult<VectorLayer> {
  try {
    const result = await drizzle
      .select({
        feature: sql<GeoJSONFeature>`
        jsonb_build_object(
          'type', 'Feature',
          'id', ${malawi.id},
          'geometry', ST_AsGeoJSON(${malawi.geom})::jsonb,
          'properties', to_jsonb(malawi.*) - 'geom' - 'id'
        )`.as("feature"),
      })
      .from(malawi)

    const features: GeoJSONFeature[] = result.map((row) => row.feature)

    const featureCollection: GeoJSONFeatureCollection = {
      type: "FeatureCollection",
      features,
    }

    if (features.length !== 1) {
      return {
        success: false,
        error: Error(
          `Expected exactly one feature for malawi layer; found ${features.length}`
        ),
      }
    }

    return {
      success: true,
      data: {
        layerName: "malawi",
        data: featureCollection,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: Error(`Database Error: ${error}`),
    }
  }
}

export async function getVectorLayer(
  layerName: string,
  from: PgTable | Subquery | PgViewBase | SQL,
  idColumn: PgColumn,
  geometryColumn: PgColumn
): DataResult<VectorLayer> {
  try {
    const result = await drizzle
      .select({
        feature: sql<GeoJSONFeature>`
        jsonb_build_object(
          'type', 'Feature',
          'id', ${idColumn},
          'geometry', ST_AsGeoJSON(${geometryColumn})::jsonb,
          'properties', to_jsonb(${from}.*) - 'geom' - 'id'
        )`.as("feature"),
      })
      .from(from)

    const featureCollection: GeoJSONFeatureCollection = {
      type: "FeatureCollection",
      features: result.map((row) => row.feature),
    }

    return {
      success: true,
      data: {
        layerName,
        data: featureCollection,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: Error(`Database Error: ${error}`),
      message: `Failed to fetch ${layerName} vector layer`,
    }
  }
}
