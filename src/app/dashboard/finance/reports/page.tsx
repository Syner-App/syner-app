import type { Metadata } from "next"

import { RequireAccess } from "@/components/require-access"
import { ReportsView } from "@/app/dashboard/finance/reports/components/reports-view"

export const metadata: Metadata = {
  title: "Reportes",
}

export default function Page() {
  return (
    <RequireAccess access="financeManager">
      <ReportsView />
    </RequireAccess>
  )
}
