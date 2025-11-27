import * as z from "zod"

export const createExampleItemSchema = z.object({
  name: z.string().min(1),
  value: z.number().nonnegative(),
})

export const updateExampleItemSchema = z
  .object({
    name: z.string().min(1),
    value: z.number().nonnegative(),
  })
  .partial()

export type CreateExampleItemFormData = z.infer<typeof createExampleItemSchema>
export type UpdateExampleItemFormData = z.infer<typeof updateExampleItemSchema>
