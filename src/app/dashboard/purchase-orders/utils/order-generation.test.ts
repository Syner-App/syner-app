import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import {
  clearOrderGenerating,
  isOrderGenerating,
  markOrderGenerating,
  useOrderGeneration,
} from "@/app/dashboard/purchase-orders/utils/order-generation"

describe("order generation", () => {
  afterEach(() => clearOrderGenerating())

  it("starts idle", () => {
    expect(isOrderGenerating()).toBe(false)
  })

  it("marks and clears the generation", () => {
    markOrderGenerating("order-1")
    expect(isOrderGenerating()).toBe(true)

    clearOrderGenerating()
    expect(isOrderGenerating()).toBe(false)
  })

  it("notifies the hook with the baseline order", () => {
    const { result } = renderHook(() => useOrderGeneration())
    expect(result.current).toBeNull()

    act(() => markOrderGenerating("order-1"))
    expect(result.current).toMatchObject({ baselineId: "order-1" })

    act(() => clearOrderGenerating())
    expect(result.current).toBeNull()
  })
})
