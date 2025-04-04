import { Calendar, Users, Inbox, Search, Settings, Files } from "lucide-react"

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
    title: "Klien",
    url: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Work Order",
    url: "/dashboard/work-orders",
    icon: Files,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-yellow-600">
        <SidebarGroup>
          <SidebarGroupLabel>Queen 69</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
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
