"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { NavGroup } from "@/app/dashboard/utils/navigation"

export function NavMain({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()
  // On phones the sidebar is a sheet: close it once a link is followed
  const { isMobile, setOpenMobile } = useSidebar()

  return groups.map((group) => (
    <SidebarGroup key={group.label}>
      <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
      <SidebarMenu>
        {group.items.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
              <Link href={item.url} onClick={() => isMobile && setOpenMobile(false)}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  ))
}
