"use client"

import { useTheme } from "next-themes"
import Link from "next/link"

import {
  LogOutIcon,
  LucideIcon,
  MoonIcon,
  SunIcon,
  SunMoonIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Theme } from "@/types/theme-types"

import { APP_SIDEBAR_ITEMS } from "../constants/app-sidebar-items"
import { ThemeDropdownMenu } from "./theme-dropdown-menu"

export function AppSidebar() {
  const { theme, setTheme } = useTheme()

  const ThemeIcon: LucideIcon =
    theme === "light" ? SunIcon : theme === "dark" ? MoonIcon : SunMoonIcon

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {APP_SIDEBAR_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>System Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuItem>
              <ThemeDropdownMenu theme={theme as Theme} setTheme={setTheme}>
                <SidebarMenuButton className="cursor-pointer">
                  <ThemeIcon />
                  <span>Theme</span>
                </SidebarMenuButton>
              </ThemeDropdownMenu>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/"}>
                <LogOutIcon />
                <span>Exit</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
