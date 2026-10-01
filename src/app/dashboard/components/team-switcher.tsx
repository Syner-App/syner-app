"use client"

import { Building2, Check, ChevronsUpDown, Loader2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { errorMessage } from "@/lib/api-client"
import { ROLE_LABELS, isSuperadmin } from "@/lib/permissions"
import type { Session } from "@/lib/types"
import { useSwitchOrganization } from "@/hooks/use-session"

// The organization the session is scoped to, and the others the user can switch to
export function TeamSwitcher({ session }: { session: Session }) {
  const { isMobile } = useSidebar()
  const switchOrganization = useSwitchOrganization()
  const { user, memberships } = session

  const active = memberships.find(({ organization_id }) => organization_id === user.organization_id)
  const title = active?.organization_name ?? (isSuperadmin(user) ? "Plataforma" : "Sin organización")
  const subtitle = active ? ROLE_LABELS[active.role] : isSuperadmin(user) ? "Superadmin" : "Elige una"

  function select(organization_id: string) {
    if (organization_id === user.organization_id) return
    switchOrganization.mutate(organization_id, {
      onError: (error) => toast.error(errorMessage(error)),
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={memberships.length === 0}>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {switchOrganization.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : active ? (
                  <Building2 />
                ) : (
                  <ShieldCheck />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{title}</span>
                <span className="truncate text-xs">{subtitle}</span>
              </div>
              {memberships.length > 0 && <ChevronsUpDown className="ml-auto" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit min-w-56"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizaciones
            </DropdownMenuLabel>
            {memberships.map((membership) => (
              <DropdownMenuItem
                key={membership.organization_id}
                onClick={() => select(membership.organization_id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Building2 className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span>{membership.organization_name}</span>
                  <span className="text-xs text-muted-foreground">{ROLE_LABELS[membership.role]}</span>
                </div>
                {membership.organization_id === user.organization_id && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
