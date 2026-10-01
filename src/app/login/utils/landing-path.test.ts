import { describe, expect, it } from "vitest"

import type { Session } from "@/lib/types"

import { landingPath } from "./landing-path"

const base = { id: "1", name: "Ana", email: "ana@syner.co" }

describe("landingPath", () => {
  it("opens the dashboard for a session scoped to an organization", () => {
    const session: Session = { user: { ...base, organization_id: "org-1", role: "user" }, memberships: [] }
    expect(landingPath(session)).toBe("/dashboard")
  })

  it("sends the superadmin without an organization to the platform", () => {
    const session: Session = { user: { ...base, platform_role: "superadmin" }, memberships: [] }
    expect(landingPath(session)).toBe("/dashboard/admin/organizations")
  })

  it("sends everyone else to the organization picker", () => {
    const session: Session = { user: base, memberships: [] }
    expect(landingPath(session)).toBe("/select-organization")
  })
})
