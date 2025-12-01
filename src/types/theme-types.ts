import { THEMES } from "@/constants/theme-constants"

export type Theme = (typeof THEMES)[number]

export interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}
