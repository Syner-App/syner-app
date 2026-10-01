import type { Metadata } from "next"

import { RequireAccess } from "@/components/require-access"
import { SalesView } from "@/app/dashboard/finance/sales/components/sales-view"

export const metadata: Metadata = {
  title: "Ventas",
}

export default function Page() {
  return (
    <RequireAccess access="financeManager">
      <SalesView />
    </RequireAccess>
  )
}
