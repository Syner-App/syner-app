import type { Metadata } from "next"

import { RequireAccess } from "@/components/require-access"
import { AlertsView } from "@/app/dashboard/alerts/components/alerts-view"

export const metadata: Metadata = {
  title: "Alertas",
}

export default function Page() {
  return (
    <RequireAccess>
      <AlertsView />
    </RequireAccess>
  )
}
