"use client"

import React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { THEMES } from "@/constants/theme-constants"
import { capitalizeFirstLetter } from "@/lib/utils/string-utils"
import { Theme } from "@/types/theme-types"

interface ThemeDropdownMenuProps {
  theme: Theme
  setTheme: (theme: Theme) => void
  children?: React.ReactNode
}

export function ThemeDropdownMenu({
  theme,
  setTheme,
  children,
}: ThemeDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(theme) => setTheme(theme as Theme)}
        >
          {Object.values(THEMES).map((theme) => (
            <DropdownMenuRadioItem key={theme} value={theme}>
              {capitalizeFirstLetter(theme)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
