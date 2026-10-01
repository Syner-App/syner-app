import Link from "next/link"
import type { ReactNode } from "react"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const TONES = {
  default: "",
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-destructive",
} as const

// A KPI tile. `value` undefined renders a skeleton; with `href` the whole tile is a link
export function StatCard({
  title,
  value,
  hint,
  icon,
  href,
  tone = "default",
}: {
  title: string
  value?: ReactNode
  hint?: ReactNode
  icon?: ReactNode
  href?: string
  tone?: keyof typeof TONES
}) {
  const card = (
    <Card size="sm" className={cn("h-full", href && "bg-transparent")}>
      <CardHeader>
        <CardDescription className="flex items-center gap-2 [&>svg]:size-4">
          {icon}
          {title}
        </CardDescription>
        <CardTitle className={cn("text-xl tabular-nums sm:text-2xl", TONES[tone])}>
          {value === undefined ? <Skeleton className="h-7 w-24" /> : value}
        </CardTitle>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardHeader>
    </Card>
  )

  return href ? (
    <Link href={href} className="rounded-xl transition-colors hover:bg-muted/50">
      {card}
    </Link>
  ) : (
    card
  )
}
