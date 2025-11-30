import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/shared/components/app-sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen flex-1 p-4">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
