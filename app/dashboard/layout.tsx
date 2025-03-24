import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Providers } from "../providers"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
        <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
            <SidebarTrigger />
            <div className="mx-15 mb-10">
                <Providers>
                    {children}
                </Providers>
            </div>
        </main>
        </SidebarProvider>
  )
}
