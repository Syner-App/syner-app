"use client"

import { Input } from "@/components/ui/input"

// <input type="number"> bound to a number: an empty input is NaN, which zod reports as
// required instead of silently sending 0. Focusing selects the value, so typing replaces it
// instead of appending to it ("0" + "5" -> "05")
export function NumberInput({
  value,
  onChange,
  onFocus,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type" | "value" | "onChange"> & {
  value: number | undefined
  onChange: (value: number) => void
}) {
  return (
    <Input
      inputMode="numeric"
      {...props}
      type="number"
      value={value === undefined || Number.isNaN(value) ? "" : value}
      onChange={(event) => onChange(event.target.value === "" ? NaN : event.target.valueAsNumber)}
      onFocus={(event) => {
        event.target.select()
        onFocus?.(event)
      }}
    />
  )
}
