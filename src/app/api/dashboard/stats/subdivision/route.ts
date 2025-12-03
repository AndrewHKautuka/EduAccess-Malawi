import { query } from "../../../../../lib/db"
import { handleError, jsonOk } from "../../dashboard-utils"

export async function GET() {
  try {
    const sql = `
      SELECT s.id, s.name, s.population::bigint AS population, s.area_sq_km::double precision AS area_sq_km,
        ST_AsGeoJSON(s.geom) AS geom_json,
        (SELECT COUNT(*) FROM schools sc WHERE ST_Contains(s.geom, sc.geom))::int AS schools
      FROM subdivisions s
      ORDER BY s.name
    `
    const res = await query<{
      id: string
      name: string
      population: string
      area_sq_km: string
      geom_json: string
      schools: number
    }>(sql)
    const features = res.rows.map((r) => ({
      type: "Feature",
      geometry: JSON.parse(r.geom_json),
      properties: {
        id: r.id,
        name: r.name,
        population: Number(r.population),
        areaSqKm: Number(r.area_sq_km),
        schools: r.schools,
      },
    }))

    return jsonOk({ type: "FeatureCollection", features })
  } catch (e) {
    return handleError(e)
  }
}
