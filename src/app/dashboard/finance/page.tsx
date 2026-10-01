import type { Metadata } from "next"

import { RequireAccess } from "@/components/require-access"
import { FinanceOverview } from "@/app/dashboard/finance/components/finance-overview"

export const metadata: Metadata = {
  title: "Resumen financiero",
}

export default function Page() {
  return (
    <RequireAccess access="financeManager">
      <FinanceOverview />
    </RequireAccess>
  )
}
