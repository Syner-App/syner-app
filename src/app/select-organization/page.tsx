import type { Metadata } from "next"

import { OrganizationPicker } from "@/app/select-organization/components/organization-picker"

export const metadata: Metadata = {
  title: "Elige una organización",
}

export default function Page() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <OrganizationPicker />
    </main>
  )
}
