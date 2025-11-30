"use client"

import { create } from "zustand"

import { ExampleStat } from "../types/example-types"

interface ExampleStore {
  stats: ExampleStat | null
  loading: boolean
  error: string | null
  load: () => Promise<void>
  reset: () => void
}

export const useExampleStore = create<ExampleStore>((set) => ({
  stats: null,
  loading: false,
  error: null,
  async load() {
    set({ loading: true, error: null })
    try {
      const res = await fetch("/api/example/coverage")
      if (!res.ok) throw new Error("Failed to load example coverage")
      const data: ExampleStat = await res.json()
      set({ stats: data, loading: false })
    } catch (e: unknown) {
      set({
        error: e instanceof Error ? e.message : "Unknown error",
        loading: false,
      })
    }
  },
  reset() {
    set({ stats: null, loading: false, error: null })
  },
}))
