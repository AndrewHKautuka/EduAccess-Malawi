import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { constructFormData } from "@/lib/utils/form-utils"

import { createExampleItem } from "../actions/example-actions"
import { CreateExampleItemFormData } from "../validations/example-validations"
import { ExampleItemForm } from "./example-item-form"

export function ExampleItemFormCreateCard() {
  async function onSubmit(data: CreateExampleItemFormData) {
    const formData: FormData = constructFormData(data)

    const result = await createExampleItem(formData)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Card>
      <CardContent>
        <ExampleItemForm onSubmit={onSubmit} />
      </CardContent>
    </Card>
  )
}
