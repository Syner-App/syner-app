import { describe, expect, it } from "vitest"

import { can, isManager, isSuperadmin } from "@/lib/permissions"

describe("permissions", () => {
  it("treats owner and admin as managers", () => {
    expect(isManager("owner")).toBe(true)
    expect(isManager("admin")).toBe(true)
    expect(isManager("user")).toBe(false)
    expect(isManager(undefined)).toBe(false)
  })

  it("recognizes the superadmin", () => {
    expect(isSuperadmin({ id: "1", name: "a", email: "a@a.co", platform_role: "superadmin" })).toBe(true)
    expect(isSuperadmin({ id: "1", name: "a", email: "a@a.co" })).toBe(false)
    expect(isSuperadmin(undefined)).toBe(false)
  })

  it("lets an admin assign and remove only users", () => {
    expect(can.assignRole("admin", "user")).toBe(true)
    expect(can.assignRole("admin", "admin")).toBe(false)
    expect(can.removeMember("admin", "owner")).toBe(false)
    expect(can.assignRole("owner", "admin")).toBe(true)
    expect(can.assignRole("user", "user")).toBe(false)
  })

  it("lets any member register a sale but only the owner run owner finance", () => {
    expect(can.registerSale("user")).toBe(true)
    expect(can.registerSale(undefined)).toBe(false)
    expect(can.ownerFinance("owner")).toBe(true)
    expect(can.ownerFinance("admin")).toBe(false)
  })
})
