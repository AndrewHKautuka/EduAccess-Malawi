import { NextRequest, NextResponse } from "next/server"

import { sql } from "drizzle-orm"

import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const maxDistance = parseFloat(searchParams.get("maxDistance") || "10000") // meters
    const limit = parseInt(searchParams.get("limit") || "100")

    // Calculate priority scores for underserved populated places
    // Priority score = (distance_to_nearest_school / max_distance) * distance_weight + size_weight
    const result = await db.execute(sql`
      WITH nearest_schools AS (
        SELECT 
          pp.id as place_id,
          pp.type as place_type,
          ST_AsGeoJSON(pp.geom)::json as place_geom,
          ST_Centroid(pp.geom) as place_center,
          MIN(ST_Distance(
            ST_Transform(ST_Centroid(pp.geom), 3857),
            ST_Transform(ef.geom, 3857)
          )) as distance_meters
        FROM populated_places pp
        CROSS JOIN LATERAL (
          SELECT geom 
          FROM education_facilities ef
          ORDER BY pp.geom <-> ef.geom
          LIMIT 1
        ) ef
        GROUP BY pp.id, pp.type, pp.geom
      ),
      place_sizes AS (
        SELECT 
          id,
          ST_Area(ST_Transform(geom, 3857)) as area_sqm
        FROM populated_places
      ),
      scored_places AS (
        SELECT 
          ns.place_id,
          ns.place_type,
          ns.place_geom,
          ST_X(ST_Transform(ns.place_center, 4326)) as longitude,
          ST_Y(ST_Transform(ns.place_center, 4326)) as latitude,
          ROUND(ns.distance_meters::numeric, 2) as distance_meters,
          ROUND((ps.area_sqm / 1000000)::numeric, 2) as area_sqkm,
          -- Priority score: higher distance and larger area = higher priority
          ROUND(
            (
              (ns.distance_meters / ${maxDistance}) * 0.7 +
              (LEAST(ps.area_sqm / 10000000, 1)) * 0.3
            ) * 100
          , 2) as priority_score
        FROM nearest_schools ns
        JOIN place_sizes ps ON ns.place_id = ps.id
        WHERE ns.distance_meters > 5000  -- Only places more than 5km from nearest school
      )
      SELECT 
        place_id,
        place_type,
        place_geom,
        longitude,
        latitude,
        distance_meters,
        area_sqkm,
        priority_score,
        CASE 
          WHEN priority_score >= 75 THEN 'critical'
          WHEN priority_score >= 50 THEN 'high'
          WHEN priority_score >= 25 THEN 'medium'
          ELSE 'low'
        END as priority_level
      FROM scored_places
      ORDER BY priority_score DESC
      LIMIT ${limit}
    `)

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    })
  } catch (error) {
    console.error("Gap analysis error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform gap analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
