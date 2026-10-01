"use client"

import { Input } from "@/components/ui/input"

// <input type="number"> bound to a number: an empty input is NaN, which zod reports as
// required instead of silently sending 0
export function NumberInput({
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type" | "value" | "onChange"> & {
  value: number | undefined
  onChange: (value: number) => void
}) {
  return (
    <Input
      {...props}
      type="number"
      inputMode="numeric"
      value={value === undefined || Number.isNaN(value) ? "" : value}
      onChange={(event) => onChange(event.target.value === "" ? NaN : event.target.valueAsNumber)}
    />
  )
}
