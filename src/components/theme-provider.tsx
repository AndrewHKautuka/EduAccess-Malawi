"use client"

import * as React from "react"

import { ThemeProvider as NextThemesProvider } from "next-themes"

import { THEMES } from "@/constants/theme-constants"
import { Theme } from "@/types/theme-types"

interface ThemeProviderProps
  extends React.ComponentProps<typeof NextThemesProvider> {
  defaultTheme?: Theme
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  ...props
}: ThemeProviderProps) {
  const themes = THEMES.map((theme) => theme)

  return (
    <NextThemesProvider
      {...props}
      themes={themes}
      defaultTheme={defaultTheme}
      enableSystem
    >
      {children}
    </NextThemesProvider>
  )
}
