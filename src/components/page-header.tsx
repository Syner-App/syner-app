import type { ReactNode } from "react"

// Phones: title, then the actions at full width. sm+: actions to the right of the title
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && (
        <div className="flex flex-col gap-2 *:w-full sm:flex-row sm:items-center sm:*:w-auto">{actions}</div>
      )}
    </div>
  )
}
