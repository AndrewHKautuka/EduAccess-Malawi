"use server"

import type { ExampleItem, ExampleStat } from "~/example/types/example-types"
import { coveragePercentage } from "~/example/utils/example-utils"

import { DataResult } from "@/shared/types/server-action-types"

import { EXAMPLE_ITEMS } from "../example-sample-data"

export async function getExampleItemById(id: string): DataResult<ExampleItem> {
  const item = EXAMPLE_ITEMS.find((item) => item.id === id)

  if (!item) {
    return {
      success: false,
      error: Error(
        "The given id does not map to an existing example items in EXAMPLE_ITEMS"
      ),
      message: "Example item not found; failed to fetch example item",
    }
  }

  return {
    success: true,
    data: item,
    message: "Successfully fetched example item",
  }
}

export async function getExampleItems(): DataResult<ExampleItem[]> {
  return {
    success: true,
    data: EXAMPLE_ITEMS,
    message: "Successfully fetched list of example items",
  }
}

export async function getExampleCoverage(): DataResult<ExampleStat> {
  const result = await getExampleItems()

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      message: "Failed to fetch example coverage",
    }
  }

  const total = result.data.reduce(
    (sum: number, item: ExampleItem) => sum + item.value,
    0
  )
  const served = Math.round(total * 0.8)

  const stat: ExampleStat = {
    total,
    served,
    coveragePercentage: coveragePercentage(total, served),
  }

  return {
    success: true,
    data: stat,
    message: "Successfully fetched example coverage",
  }
}
