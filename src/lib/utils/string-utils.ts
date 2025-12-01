export function capitalizeFirstLetter(
  inputString?: string
): string | undefined {
  if (!inputString) {
    return inputString
  }

  return inputString.charAt(0).toUpperCase() + inputString.slice(1)
}

export function joinStringsHumanReadable(
  endingSeparator: string,
  strings: readonly string[],
  mainSeparator?: string
): string {
  if (strings.length === 0) {
    return ""
  }

  if (strings.length === 1) {
    return strings[0]
  }

  const joinedStrings = strings.toSpliced(-1).join(mainSeparator)

  return `${joinedStrings}${endingSeparator}${strings[-1]}`
}
