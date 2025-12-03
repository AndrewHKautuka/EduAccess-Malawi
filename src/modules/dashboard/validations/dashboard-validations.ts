import * as z from "zod"

export const dashboardFiltersSchema = z.object({
  subdivisionId: z.string().optional(),
  radiusMeters: z
    .number()
    .int()
    .min(1000, "Minimum radius is 1km")
    .max(100000, "Maximum radius is 100km")
    .optional(),
})

export type DashboardFiltersInput = z.infer<typeof dashboardFiltersSchema>
