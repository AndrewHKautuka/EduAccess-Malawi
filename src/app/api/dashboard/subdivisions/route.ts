import { query } from "../../../../lib/db"
import { handleError, jsonOk } from "../dashboard-utils"

export async function GET() {
  try {
    const sql = `SELECT id, name, ST_AsGeoJSON(geom) AS geom_json FROM subdivisions ORDER BY name`
    const res = await query<{ id: string; name: string; geom_json: string }>(
      sql
    )
    const features = res.rows.map((r) => ({
      type: "Feature",
      geometry: JSON.parse(r.geom_json),
      properties: { id: r.id, name: r.name },
    }))
    return jsonOk({ type: "FeatureCollection", features })
  } catch (e) {
    return handleError(e)
  }
}
