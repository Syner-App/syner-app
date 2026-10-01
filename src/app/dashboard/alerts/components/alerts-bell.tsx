"use client"

import { Bell } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { useActiveAlertsCount } from "@/app/dashboard/alerts/hooks/useAlerts"
import { useSession } from "@/hooks/use-session"

// Header shortcut to the alerts with the live active count. On phones the sidebar is
// hidden behind the trigger, so this is where the count stays visible
export function AlertsBell() {
  const { data: session } = useSession()
  const hasOrganization = Boolean(session?.user.organization_id)
  const { data: count = 0 } = useActiveAlertsCount(hasOrganization)

  if (!hasOrganization) return null

  const label = count > 0 ? `Alertas: ${count} activas` : "Alertas"
  return (
    <Button asChild variant="ghost" size="icon" className="relative" aria-label={label}>
      <Link href="/dashboard/alerts">
        <Bell />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] leading-none font-medium text-white tabular-nums">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </Button>
  )
}
