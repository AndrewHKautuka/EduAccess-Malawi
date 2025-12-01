export function capitalizeFirstLetter(
  inputString?: string
): string | undefined {
  if (!inputString) {
    return inputString
  }

  return inputString.charAt(0).toUpperCase() + inputString.slice(1)
}
