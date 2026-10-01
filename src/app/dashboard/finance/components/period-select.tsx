"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatPeriod, recentPeriods } from "@/lib/format"

const ALL = "all"

// The last 12 periods (YYYY-MM). With `allowAll`, "" means every period
export function PeriodSelect({
  value,
  onChange,
  allowAll = false,
  className = "w-full sm:w-52",
}: {
  value: string
  onChange: (period: string) => void
  allowAll?: boolean
  className?: string
}) {
  return (
    <Select value={value || ALL} onValueChange={(next) => onChange(next === ALL ? "" : next)}>
      <SelectTrigger aria-label="Periodo" className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {allowAll && <SelectItem value={ALL}>Todos los periodos</SelectItem>}
        {recentPeriods().map((period) => (
          <SelectItem key={period} value={period}>
            {formatPeriod(period)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
