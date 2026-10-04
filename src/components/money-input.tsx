"use client"

import { useState } from "react"

import { Input } from "@/components/ui/input"

const whole = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 })

const MAX_DECIMALS = 4

// "1.500.000" -> 1500000 and "1.500,25" -> 1500.25: dots group thousands, the comma is the
// decimal separator. Empty text is NaN, which zod reports as required
function parse(text: string): number {
  const [integer, decimals = ""] = text.replace(/\./g, "").split(",")
  if (!integer && !decimals) return NaN
  return Number(`${integer || "0"}.${decimals || "0"}`)
}

// Keeps what the user typed (digits and, when decimal, one comma) and groups the thousands
function clean(text: string, decimal: boolean): string {
  const [integer, ...rest] = text.replace(decimal ? /[^\d,]/g : /\D/g, "").split(",")
  const digits = integer.replace(/^0+(?=\d)/, "")
  const grouped = digits ? whole.format(Number(digits)) : ""
  if (!decimal || rest.length === 0) return grouped
  return `${grouped || "0"},${rest.join("").slice(0, MAX_DECIMALS)}`
}

function format(value: number | undefined, decimal: boolean): string {
  if (value === undefined || Number.isNaN(value)) return ""
  const [integer, decimals] = String(value).split(".")
  const grouped = whole.format(Number(integer))
  return decimal && decimals ? `${grouped},${decimals.slice(0, MAX_DECIMALS)}` : grouped
}

// Text input for amounts of money bound to a number: shows the thousands grouped while typing
// ("1.500.000") instead of the raw digits of <input type="number">
export function MoneyInput({
  value,
  onChange,
  onFocus,
  decimal = false,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type" | "value" | "onChange" | "inputMode"> & {
  value: number | undefined
  onChange: (value: number) => void
  decimal?: boolean
}) {
  const [text, setText] = useState(() => format(value, decimal))
  // The typed text wins while it still means the form value ("1.500," while typing decimals);
  // a value set from outside (reset, edit dialog) replaces it
  const display = Object.is(parse(text), value ?? NaN) ? text : format(value, decimal)

  return (
    <Input
      {...props}
      type="text"
      inputMode={decimal ? "decimal" : "numeric"}
      autoComplete="off"
      value={display}
      onChange={(event) => {
        const next = clean(event.target.value, decimal)
        setText(next)
        onChange(parse(next))
      }}
      onFocus={(event) => {
        event.target.select()
        onFocus?.(event)
      }}
    />
  )
}
