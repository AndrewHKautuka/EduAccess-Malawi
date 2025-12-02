"use server"

import { sql } from "drizzle-orm"

import { drizzle } from "@/lib/db/drizzle"
import { malawi } from "@/lib/db/schema"
import {
  GeoJSONFeature,
  GeoJSONFeatureCollection,
  VectorLayer,
} from "@/shared/types/layer-types"
import { DataResult } from "@/shared/types/server-action-types"

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
      features: result.map((row) => row.feature),
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
