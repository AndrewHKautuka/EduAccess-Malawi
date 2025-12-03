import { NextResponse } from "next/server"

import * as z from "zod"

import { query } from "../../../../../../lib/db"
import { handleError, jsonOk } from "../../../dashboard-utils"

const idSchema = z.object({ id: z.string().min(1) })

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const parsed = idSchema.parse(params)
    const id = parsed.id

    const sql = `
      SELECT s.id, s.name, s.population::bigint AS population, s.area_sq_km::double precision AS area_sq_km,
        ST_AsGeoJSON(s.geom) AS geom_json,
        (SELECT COUNT(*) FROM schools sc WHERE ST_Contains(s.geom, sc.geom))::int AS schools
      FROM subdivisions s
      WHERE s.id = $1
      LIMIT 1
    `
    const res = await query<{
      id: string
      name: string
      population: string
      area_sq_km: string
      geom_json: string
      schools: number
    }>(sql, [id])
    if (res.rowCount === 0) {
      return NextResponse.json(
        { status: "error", error: "Not found" },
        { status: 404 }
      )
    }
    const r = res.rows[0]
    const feature = {
      type: "Feature",
      geometry: JSON.parse(r.geom_json),
      properties: {
        id: r.id,
        name: r.name,
        population: Number(r.population),
        areaSqKm: Number(r.area_sq_km),
        schools: r.schools,
      },
    }
    return jsonOk(feature)
  } catch (e) {
    return handleError(e)
  }
}
