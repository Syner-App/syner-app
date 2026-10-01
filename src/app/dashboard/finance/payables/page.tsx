import type { Metadata } from "next"

import { RequireAccess } from "@/components/require-access"
import { PayablesView } from "@/app/dashboard/finance/payables/components/payables-view"

export const metadata: Metadata = {
  title: "Cuentas por pagar",
}

export default function Page() {
  return (
    <RequireAccess access="financeManager">
      <PayablesView />
    </RequireAccess>
  )
}
