import { toast } from "sonner"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { constructFormData } from "@/lib/utils/form-utils"

import { updateExampleItem } from "../actions/example-actions"
import { ExampleItem } from "../types/example-types"
import { CreateExampleItemFormData } from "../validations/example-validations"
import { ExampleItemForm } from "./example-item-form"

interface ExampleItemEditDialogProps {
  item?: ExampleItem
  onSuccess: () => void
  onCancel: () => void
}

export function ExampleItemEditDialog({
  item,
  onSuccess,
  onCancel,
}: ExampleItemEditDialogProps) {
  async function onSubmit(data: CreateExampleItemFormData) {
    if (!item) {
      return
    }

    const formData: FormData = constructFormData(data)

    const result = await updateExampleItem(item.id, formData)

    if (result.success) {
      toast.success(result.message)
      onSuccess()
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Dialog open={!!item} onOpenChange={onCancel}>
      <DialogContent>
        <DialogTitle>Edit Example Item {item?.id}</DialogTitle>
        <ExampleItemForm item={item} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}
