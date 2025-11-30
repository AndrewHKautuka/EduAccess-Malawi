import { useId } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { ExampleItem } from "../types/example-types"
import {
  type CreateExampleItemFormData,
  createExampleItemSchema,
} from "../validations/example-validations"

interface ExampleItemFormProps {
  item?: ExampleItem
  onSubmit: (data: CreateExampleItemFormData) => void
}

export function ExampleItemForm({ item, onSubmit }: ExampleItemFormProps) {
  const formId = useId()
  const nameFieldId = useId()
  const valueFieldId = useId()

  const form = useForm({
    resolver: zodResolver(createExampleItemSchema),
    defaultValues: item
      ? {
          name: item.name,
          value: item.value.toString(),
        }
      : {
          name: "",
          value: "0",
        },
  })

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={nameFieldId}>Name</FieldLabel>

              <Input
                {...field}
                id={nameFieldId}
                aria-invalid={fieldState.invalid}
                placeholder="Enter example name"
                autoComplete="off"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="value"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={valueFieldId}>Value</FieldLabel>

              <Input
                {...field}
                id={valueFieldId}
                type="number"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field orientation="horizontal">
          <Button type="submit" form={formId} variant="default">
            Create
          </Button>

          <div className="flex-1" />

          <Button variant="destructive" onClick={() => form.reset()}>
            Reset
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
