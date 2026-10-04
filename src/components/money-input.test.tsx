import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { MoneyInput } from "@/components/money-input"

function Controlled({ initial, decimal, onValue }: { initial?: number; decimal?: boolean; onValue?: (value: number) => void }) {
  const [value, setValue] = useState<number | undefined>(initial)
  return (
    <MoneyInput
      aria-label="Monto"
      decimal={decimal}
      value={value}
      onChange={(next) => {
        setValue(next)
        onValue?.(next)
      }}
    />
  )
}

const input = () => screen.getByLabelText("Monto") as HTMLInputElement

describe("MoneyInput", () => {
  it("groups the thousands while typing and emits the number", () => {
    const onValue = vi.fn()
    render(<Controlled onValue={onValue} />)
    fireEvent.change(input(), { target: { value: "1500000" } })
    expect(input().value).toBe("1.500.000")
    expect(onValue).toHaveBeenLastCalledWith(1500000)
  })

  it("shows the initial value grouped", () => {
    render(<Controlled initial={742100} />)
    expect(input().value).toBe("742.100")
  })

  it("emits NaN when cleared so zod reports it as required", () => {
    const onValue = vi.fn()
    render(<Controlled initial={1000} onValue={onValue} />)
    fireEvent.change(input(), { target: { value: "" } })
    expect(input().value).toBe("")
    expect(onValue).toHaveBeenLastCalledWith(NaN)
  })

  it("keeps a decimal comma when decimal", () => {
    const onValue = vi.fn()
    render(<Controlled decimal onValue={onValue} />)
    fireEvent.change(input(), { target: { value: "1500," } })
    expect(input().value).toBe("1.500,")
    fireEvent.change(input(), { target: { value: "1.500,25" } })
    expect(input().value).toBe("1.500,25")
    expect(onValue).toHaveBeenLastCalledWith(1500.25)
  })

  it("ignores the comma when not decimal", () => {
    render(<Controlled />)
    fireEvent.change(input(), { target: { value: "12,5" } })
    expect(input().value).toBe("125")
  })
})
