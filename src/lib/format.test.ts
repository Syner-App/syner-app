import { afterEach, describe, expect, it, vi } from "vitest"

import {
  currentPeriod,
  formatDate,
  formatPeriod,
  recentPeriods,
  today,
} from "@/lib/format"

describe("format", () => {
  afterEach(() => vi.useRealTimers())

  it("reads a YYYY-MM-DD date as a local date", () => {
    expect(formatDate("2026-09-01")).toMatch(/1.*sept.*2026/i)
  })

  it("returns invalid dates unchanged", () => {
    expect(formatDate("not a date")).toBe("not a date")
    expect(formatPeriod("nope")).toBe("nope")
  })

  it("capitalizes the period name", () => {
    expect(formatPeriod("2026-09")).toMatch(/^Septiembre.*2026$/)
  })

  it("derives today, the current period and the recent periods", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 15))

    expect(today()).toBe("2026-01-15")
    expect(currentPeriod()).toBe("2026-01")
    expect(recentPeriods(3)).toEqual(["2026-01", "2025-12", "2025-11"])
  })
})
