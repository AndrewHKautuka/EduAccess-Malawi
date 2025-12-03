import { AVAILABLE_LAYERS } from "../constants/layer-constants"

export function isValidLayer(
  layerName: string
): layerName is keyof typeof AVAILABLE_LAYERS {
  return layerName in AVAILABLE_LAYERS
}
