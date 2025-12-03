/**
 * Returns true if bounds changed by more than 5% in any dimension
 */
export function hasBboxChangedSignificantly(
  oldBbox: [number, number, number, number] | undefined,
  newBbox: [number, number, number, number]
): boolean {
  if (!oldBbox) return true

  const [oldMinLng, oldMinLat, oldMaxLng, oldMaxLat] = oldBbox
  const [newMinLng, newMinLat, newMaxLng, newMaxLat] = newBbox

  const oldWidth = oldMaxLng - oldMinLng
  const oldHeight = oldMaxLat - oldMinLat
  const newWidth = newMaxLng - newMinLng
  const newHeight = newMaxLat - newMinLat

  // Check if center moved significantly (more than 5% of the old dimensions)
  const centerLngDiff = Math.abs(
    (oldMinLng + oldMaxLng) / 2 - (newMinLng + newMaxLng) / 2
  )
  const centerLatDiff = Math.abs(
    (oldMinLat + oldMaxLat) / 2 - (newMinLat + newMaxLat) / 2
  )

  const thresholdLng = oldWidth * 0.05
  const thresholdLat = oldHeight * 0.05

  // Check if zoom level changed significantly (more than 5% change in dimensions)
  const widthChange = Math.abs(newWidth - oldWidth) / oldWidth
  const heightChange = Math.abs(newHeight - oldHeight) / oldHeight

  return (
    centerLngDiff > thresholdLng ||
    centerLatDiff > thresholdLat ||
    widthChange > 0.05 ||
    heightChange > 0.05
  )
}
