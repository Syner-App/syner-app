import type { Metadata } from "next"

import { RequireAccess } from "@/components/require-access"
import { RecipesView } from "@/app/dashboard/finance/recipes/components/recipes-view"

export const metadata: Metadata = {
  title: "Productos e insumos",
}

export default function Page() {
  return (
    <RequireAccess access="financeManager">
      <RecipesView />
    </RequireAccess>
  )
}
