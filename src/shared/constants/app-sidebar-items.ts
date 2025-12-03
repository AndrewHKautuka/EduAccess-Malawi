import { MapIcon, TrendingUpIcon } from "lucide-react"

import { SidebarNavItem } from "../types/app-sidebar-types"

export const APP_SIDEBAR_ITEMS: SidebarNavItem[] = [
  {
    title: "Map",
    url: "/map",
    icon: MapIcon,
  },
  {
    title: "Gap Analysis",
    url: "/gap-analysis",
    icon: TrendingUpIcon,
  },
]
