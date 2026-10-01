import type { Metadata } from "next"

import { RequireAccess } from "@/components/require-access"
import { CreditsView } from "@/app/dashboard/finance/credits/components/credits-view"

export const metadata: Metadata = {
  title: "Créditos",
}

export default function Page() {
  return (
    <RequireAccess access="financeManager">
      <CreditsView />
    </RequireAccess>
  )
}
