import { Users, Files, PersonStanding, Receipt } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Karyawan",
    url: "/dashboard/employees",
    icon: PersonStanding,
  },
  {
    title: "Klien",
    url: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Surat Perintah Kerja",
    url: "/dashboard/work-orders",
    icon: Files,
  },
  {
    title: "Invoice",
    url: "/dashboard/invoices",
    icon: Receipt,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-[black]">
        <SidebarGroup>
          <SidebarGroupLabel>Queen 69</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-[gold] hover:text-[black]">
                    <a href={item.url} className="text-white">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
