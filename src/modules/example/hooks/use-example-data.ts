"use client"

import { useEffect } from "react"

import { useExampleStore } from "./use-example-store"

export function useExampleData() {
  const { stats, loading, error, load } = useExampleStore()

  useEffect(() => {
    if (!stats && !loading) {
      void load()
    }
  }, [stats, loading, load])

  return { stats, loading, error, load }
}
