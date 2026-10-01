import { formatMoney } from "@/lib/format"
import { cn } from "@/lib/utils"

export interface MoneyRow {
  label: string
  value: number
  // total: bold with a rule above; negative: shown as a subtraction
  kind?: "total" | "negative"
  hint?: string
}

// A statement as label/amount rows (income statement, waterfall, break-even)
export function MoneyRows({ rows }: { rows: MoneyRow[] }) {
  return (
    <dl className="flex flex-col text-sm">
      {rows.map((row) => (
        <div
          key={row.label}
          className={cn(
            "flex items-baseline justify-between gap-4 py-1.5",
            row.kind === "total" && "mt-1 border-t pt-2.5 font-semibold"
          )}
        >
          <dt className={cn("min-w-0", row.kind !== "total" && "text-muted-foreground")}>
            {row.label}
            {row.hint && <span className="block text-xs font-normal text-muted-foreground">{row.hint}</span>}
          </dt>
          <dd className={cn("shrink-0 tabular-nums", row.kind === "total" && row.value < 0 && "text-destructive")}>
            {row.kind === "negative" && row.value > 0 ? "−" : ""}
            {formatMoney(row.value)}
          </dd>
        </div>
      ))}
    </dl>
  )
}
