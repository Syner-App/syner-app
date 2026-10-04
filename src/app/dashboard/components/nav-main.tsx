"use client"

import { Loader2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
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
                {item.loading ? (
                  // size-3.5 matches the text-sm label; ! beats the button's [&_svg]:size-4
                  <span className="flex items-center gap-1.5">
                    {item.title}
                    <Loader2 className="size-3.5! animate-spin" aria-label="Generando orden de compra" />
                  </span>
                ) : (
                  <span>{item.title}</span>
                )}
              </Link>
            </SidebarMenuButton>
            {item.badge ? (
              <SidebarMenuBadge className="bg-destructive text-white peer-hover/menu-button:text-white peer-data-active/menu-button:text-white">
                {item.badge > 99 ? "99+" : item.badge}
              </SidebarMenuBadge>
            ) : null}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  ))
}
