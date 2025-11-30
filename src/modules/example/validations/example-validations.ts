import * as z from "zod"

export const createExampleItemSchema = z.object({
  name: z.string().min(1),
  value: z.coerce
    .number<string>("Value must be a number")
    .nonnegative("Value must be greater than or equal to 0"),
})

export const updateExampleItemSchema = z
  .object({
    name: z.string().min(1),
    value: z.coerce
      .number<string>("Value must be a number")
      .nonnegative("Value must be greater than or equal to 0"),
  })
  .partial()

export type CreateExampleItemFormData = z.infer<typeof createExampleItemSchema>
export type UpdateExampleItemFormData = z.infer<typeof updateExampleItemSchema>
