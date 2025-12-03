import * as z from "zod"

import { query } from "../../../../lib/db"
import { handleError, jsonOk } from "../dashboard-utils"

const schema = z.object({ top: z.number().int().min(1).max(100).optional() })

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const top =
      schema.parse({
        top: url.searchParams.get("top")
          ? Number(url.searchParams.get("top"))
          : undefined,
      }).top ?? 10
    const sql = `
      SELECT s.id, s.name, COUNT(sc.*)::int AS schools, COALESCE(SUM(pc.population),0)::bigint AS population
      FROM subdivisions s
      LEFT JOIN schools sc ON ST_Contains(s.geom, sc.geom)
      LEFT JOIN population_centroids pc ON ST_Contains(s.geom, pc.geom)
      GROUP BY s.id, s.name
      ORDER BY schools DESC
      LIMIT $1
    `
    const res = await query<{
      id: string
      name: string
      schools: number
      population: string
    }>(sql, [top])
    const series = res.rows.map((r) => ({
      id: r.id,
      label: r.name,
      data: [Number(r.schools), Number(r.population)],
    }))
    return jsonOk(series)
  } catch (e) {
    return handleError(e)
  }
}
