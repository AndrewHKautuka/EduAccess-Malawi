import { NextRequest, NextResponse } from "next/server"

import { getVectorLayer } from "~/map/data/map-data"

import { AVAILABLE_LAYERS } from "@/shared/constants/layer-constants"
import { isValidLayer } from "@/shared/utils/layer-utils"

export async function GET(
  request: NextRequest,
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

  // Parse bounding box from query parameters if provided
  // Format: bbox=minLng,minLat,maxLng,maxLat
  const bboxParam = request.nextUrl.searchParams.get("bbox")
  let bbox: [number, number, number, number] | undefined

  if (bboxParam) {
    const bboxValues = bboxParam.split(",").map(Number)
    if (bboxValues.length === 4 && bboxValues.every((val) => !isNaN(val))) {
      bbox = bboxValues as [number, number, number, number]
    }
  }

  const result = await getVectorLayer(layerName, bbox)

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
