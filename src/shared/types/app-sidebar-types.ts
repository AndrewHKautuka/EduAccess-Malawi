import { Url } from "next/dist/shared/lib/router/router"

import { LucideIcon } from "lucide-react"

export interface SidebarNavItem {
  title: string
  url: Url
  icon: LucideIcon
}
