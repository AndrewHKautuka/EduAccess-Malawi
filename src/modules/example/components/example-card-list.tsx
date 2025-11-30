"use client"

import { useState } from "react"

import { toast } from "sonner"

import { deleteExampleItem } from "../actions/example-actions"
import { ExampleItem } from "../types/example-types"
import { ExampleCard } from "./example-card"
import { ExampleItemEditDialog } from "./example-item-edit-dialog"
import { ExampleItemFormCreateCard } from "./example-item-form-create-card"

interface ExampleCardListProps {
  items: ExampleItem[]
}

export function ExampleCardList({ items }: ExampleCardListProps) {
  const [itemToEdit, setItemToEdit] = useState<ExampleItem | null>(null)

  return (
    <div className="mt-12 flex w-full flex-col gap-4">
      {items.map((item) => (
        <ExampleCard
          key={item.id}
          item={item}
          onEdit={async (item) => {
            setItemToEdit(item)
          }}
          onDelete={async (item) => {
            const result = await deleteExampleItem(item.id)

            if (result.success) {
              toast.success(result.message)
            } else {
              toast.error(result.message)
            }
          }}
        />
      ))}

      <ExampleItemFormCreateCard />

      {itemToEdit && (
        <ExampleItemEditDialog
          item={itemToEdit}
          onSuccess={() => setItemToEdit(null)}
          onCancel={() => setItemToEdit(null)}
        />
      )}
    </div>
  )
}
