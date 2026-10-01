import type { Metadata } from "next"

import { RequireAccess } from "@/components/require-access"
import { OrganizationsView } from "@/app/dashboard/admin/organizations/components/organizations-view"

export const metadata: Metadata = {
  title: "Organizaciones",
}

export default function Page() {
  return (
    <RequireAccess organization={false} access="superadmin">
      <OrganizationsView />
    </RequireAccess>
  )
}
