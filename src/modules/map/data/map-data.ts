"use server"

import { sql } from "drizzle-orm"

import { drizzle } from "@/lib/db/drizzle"
import { malawi } from "@/lib/db/schema"
import { joinStringsHumanReadable } from "@/lib/utils/string-utils"
import { AVAILABLE_LAYERS } from "@/shared/constants/layer-constants"
import {
  GeoJSONFeature,
  GeoJSONFeatureCollection,
  VectorLayer,
} from "@/shared/types/layer-types"
import { DataResult } from "@/shared/types/server-action-types"
import { isValidLayer } from "@/shared/utils/layer-utils"

export async function getAllVectorLayers(): DataResult<VectorLayer[]> {
  const results = await Promise.all([
    getAllAdminBoundaryLayers(),
    getAllInfrastructureLayers(),
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
    getVectorLayer("regions"),
    getVectorLayer("districts"),
    getVectorLayer("district_subdivisions"),
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

export async function getAllInfrastructureLayers(): DataResult<VectorLayer[]> {
  const results = await Promise.all([
    getVectorLayer("education_facilities"),
    getVectorLayer("populated_places"),
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
  bbox?: [number, number, number, number] // [minLng, minLat, maxLng, maxLat]
): DataResult<VectorLayer> {
  try {
    if (!isValidLayer(layerName)) {
      console.log(Object.keys(AVAILABLE_LAYERS))
      return {
        success: false,
        error: Error("Invalid layerName"),
        message: `${layerName} is not a valid layer name. The valid layer names are ${joinStringsHumanReadable(" and ", Object.keys(AVAILABLE_LAYERS))}`,
      }
    }

    const layerConfig = AVAILABLE_LAYERS[layerName]

    let query = drizzle
      .select({
        feature: sql<GeoJSONFeature>`
        jsonb_build_object(
          'type', 'Feature',
          'id', ${layerConfig.idColumn},
          'geometry', ST_AsGeoJSON(${layerConfig.geometryColumn})::jsonb,
          'properties', to_jsonb(${layerConfig.table}.*) - 'geom' - 'id'
        )`.as("feature"),
      })
      .from(layerConfig.table)

    // Apply bounding box filter if provided
    if (bbox) {
      const [minLng, minLat, maxLng, maxLat] = bbox
      query = query.where(
        sql`ST_Intersects(
          ${layerConfig.geometryColumn},
          ST_MakeEnvelope(${sql.raw(String(minLng))}, ${sql.raw(String(minLat))}, ${sql.raw(String(maxLng))}, ${sql.raw(String(maxLat))}, 4326)
        )`
      ) as typeof query
    }

    const result = await query

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
