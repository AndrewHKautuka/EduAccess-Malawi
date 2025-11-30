"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ExampleItem } from "../types/example-types"

interface ExampleCardProps {
  item: ExampleItem
  onEdit: (item: ExampleItem) => void
  onDelete: (item: ExampleItem) => void
}

export function ExampleCard({ item, onEdit, onDelete }: ExampleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground mt-2">{item.value}</p>
      </CardContent>

      <CardFooter>
        <Button onClick={() => onEdit(item)} variant="default">
          Edit
        </Button>

        <div className="flex-1" />

        <Button onClick={() => onDelete(item)} variant="destructive">
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
