import { cookies } from "next/headers"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/shared/components/app-sidebar"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="min-h-screen flex-1 p-4">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
