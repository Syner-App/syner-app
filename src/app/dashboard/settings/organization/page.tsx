import type { Metadata } from "next"

import { RequireAccess } from "@/components/require-access"
import { OrganizationSettings } from "@/app/dashboard/settings/organization/components/organization-settings"

export const metadata: Metadata = {
  title: "Organización",
}

export default function Page() {
  return (
    <RequireAccess access="organizationManager">
      <OrganizationSettings />
    </RequireAccess>
  )
}
