import * as z from "zod"

import { query } from "../../../../../lib/db"
import { handleError, jsonOk } from "../../dashboard-utils"

const nationalSchema = z.object({
  coverageRadius: z.number().int().min(1000).max(20000).optional(),
})

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const coverageRadius = url.searchParams.get("coverageRadius")
    const parsed = nationalSchema.parse({
      coverageRadius: coverageRadius ? Number(coverageRadius) : undefined,
    })
    const radius = parsed.coverageRadius ?? 5000

    const totalRes = await query<{ total_schools: string }>(
      "SELECT COUNT(*)::int AS total_schools FROM schools"
    )
    const totalSchools = Number(totalRes.rows[0]?.total_schools ?? 0)

    const popRes = await query<{ total_pop: string }>(
      "SELECT COALESCE(SUM(population),0)::bigint AS total_pop FROM population_centroids"
    )
    const totalPopulation = Number(popRes.rows[0]?.total_pop ?? 0)

    const coveredRes = await query<{ covered_pop: string }>(
      `SELECT COALESCE(SUM(pc.population),0)::bigint AS covered_pop
       FROM population_centroids pc
       WHERE EXISTS (
         SELECT 1 FROM schools s WHERE ST_DWithin(pc.geom::geography, s.geom::geography, $1)
       )`,
      [radius]
    )
    const coveredPopulation = Number(coveredRes.rows[0]?.covered_pop ?? 0)

    const avgDistRes = await query<{ avg_dist: number }>(
      `SELECT AVG(min_dist)::double precision AS avg_dist FROM (
         SELECT (SELECT MIN(ST_Distance(pc.geom::geography, s.geom::geography)) FROM schools s) AS min_dist
         FROM population_centroids pc
       ) t`
    )
    const averageDistance = Number(avgDistRes.rows[0]?.avg_dist ?? 0)

    const coveragePercentage =
      totalPopulation === 0 ? 0 : (coveredPopulation / totalPopulation) * 100

    const result = {
      totalSchools,
      averageDistance,
      schoolPopulationRatio:
        totalPopulation === 0 ? 0 : totalSchools / totalPopulation,
      coveragePercentage,
      lastUpdated: new Date().toISOString(),
      subdivisions: [],
      metrics: [
        {
          id: "totalSchools",
          label: "Total Schools",
          value: totalSchools,
          unit: "",
          description: null,
        },
      ],
    } as const

    return jsonOk(result)
  } catch (e) {
    return handleError(e)
  }
}
