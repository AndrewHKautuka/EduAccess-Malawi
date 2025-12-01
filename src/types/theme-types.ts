import { THEMES } from "@/constants/theme-constants"

type ThemesKey = keyof typeof THEMES
export type Theme = (typeof THEMES)[ThemesKey]

export interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}
