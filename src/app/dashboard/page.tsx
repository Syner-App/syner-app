import type { Metadata } from "next"

import { RequireAccess } from "@/components/require-access"
import { DashboardSummary } from "@/app/dashboard/components/dashboard-summary"

export const metadata: Metadata = {
  title: "Panel",
}

export default function Page() {
  return (
    <RequireAccess>
      <DashboardSummary />
    </RequireAccess>
  )
}
