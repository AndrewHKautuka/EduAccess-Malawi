export function constructFormData(data: object): FormData {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value == null) {
      formData.append(key, "")
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString())
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, String(value))
    }
  })

  return formData
}
