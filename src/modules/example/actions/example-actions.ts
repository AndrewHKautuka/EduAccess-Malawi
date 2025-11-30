"use server"

import { revalidatePath } from "next/cache"

import { randomUUID } from "crypto"
import type { ExampleItem } from "~/example/types/example-types"
import {
  createExampleItemSchema,
  updateExampleItemSchema,
} from "~/example/validations/example-validations"

import { ActionResult, CreateResult } from "@/shared/types/server-action-types"

import { EXAMPLE_ITEMS } from "../example-sample-data"

const REVAILDATE_PATHS: string[] = ["/"]

export async function createExampleItem(
  formData: FormData
): CreateResult<string> {
  const revalidatePaths = REVAILDATE_PATHS

  const result = createExampleItemSchema.safeParse(formData)

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      message: "Failed to create example item",
    }
  }

  const id = randomUUID()
  const newItem: ExampleItem = {
    ...result.data,
    id,
  }

  EXAMPLE_ITEMS.push(newItem)

  revalidatePaths.forEach((path) => revalidatePath(path))

  return {
    success: true,
    id,
    message: "Successfully created example item",
  }
}

export async function updateExampleItem(
  id: string,
  formData: FormData
): ActionResult {
  const revalidatePaths = REVAILDATE_PATHS

  const result = updateExampleItemSchema.safeParse(formData)

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      message: "Invalid form; failed to update example item",
    }
  }

  const index = EXAMPLE_ITEMS.findIndex((item) => item.id === id)

  if (index === -1) {
    return {
      success: false,
      error: Error(
        "The given id does not map to an existing example items in EXAMPLE_ITEMS"
      ),
      message: "Example item not found; failed to update example item",
    }
  }

  const updatedItem: ExampleItem = {
    ...EXAMPLE_ITEMS[index],
    ...result.data,
  }

  EXAMPLE_ITEMS[index] = updatedItem

  revalidatePaths.forEach((path) => revalidatePath(path))

  return {
    success: true,
    message: "Successfully updated example item",
  }
}

export async function deleteExampleItem(id: string): ActionResult {
  const revalidatePaths = REVAILDATE_PATHS

  const index = EXAMPLE_ITEMS.findIndex((item) => item.id === id)

  if (index === -1) {
    return {
      success: false,
      error: Error(
        "The given id does not map to an existing example items in EXAMPLE_ITEMS"
      ),
      message: "Example item not found; failed to delete example item",
    }
  }

  EXAMPLE_ITEMS.splice(index, 1)

  revalidatePaths.forEach((path) => revalidatePath(path))

  return {
    success: true,
    message: "Successfully deleted example item",
  }
}
