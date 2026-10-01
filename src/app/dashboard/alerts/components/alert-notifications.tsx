"use client"

import { useAlertNotifications } from "@/app/dashboard/alerts/hooks/useAlertNotifications"
import { useSession } from "@/hooks/use-session"

// Mounted once by the dashboard layout: keeps the notifications socket open
export function AlertNotifications() {
  const { data: session } = useSession()
  useAlertNotifications(session?.user.organization_id)
  return null
}
