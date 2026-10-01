import type { Metadata } from "next"

import { RequireAccess } from "@/components/require-access"
import { MovementsView } from "@/app/dashboard/finance/movements/components/movements-view"

export const metadata: Metadata = {
  title: "Movimientos",
}

export default function Page() {
  return (
    <RequireAccess access="financeManager">
      <MovementsView />
    </RequireAccess>
  )
}
