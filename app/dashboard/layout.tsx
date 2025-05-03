"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { UserButton, useUser } from "@clerk/nextjs"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()

  return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <SidebarTrigger />
                <div className="mx-15 mb-10">
                  <div className="flex justify-between mb-5">
                    <p>Selamat datang, {user?.firstName}!</p>
                    <UserButton />
                  </div>
                  {children}
                </div>
            </main>
        </SidebarProvider>
  )
}
