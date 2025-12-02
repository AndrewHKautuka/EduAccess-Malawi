import { NextRequest, NextResponse } from "next/server"

import { getVectorLayer } from "~/map/data/map-data"

import { AVAILABLE_LAYERS } from "@/shared/constants/layer-constants"
import { isValidLayer } from "@/shared/utils/layer-utils"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ layerName: string }> }
) {
  const { layerName } = await params

  if (!isValidLayer(layerName)) {
    return NextResponse.json(
      {
        error: "Invalid layer",
        availableLayers: Object.keys(AVAILABLE_LAYERS),
      },
      { status: 400 }
    )
  }

  const result = await getVectorLayer(layerName)

  if (result.success) {
    return NextResponse.json(result.data, {
      headers: {
        "Content-Type": "application/geo+json",
        "Cache-Control": "public, max-age=300", // Cache for 5 minutes
      },
    })
  } else {
    console.error("Error fetching vector layer:", result.error)
    return NextResponse.json(
      { error: "Failed to fetch layer data" },
      { status: 500 }
    )
  }
}
