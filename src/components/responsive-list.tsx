"use client"

import type { ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface Column<T> {
  header: ReactNode
  cell: (item: T) => ReactNode
  // Applied to the header and the cells (text-right, w-32, hidden lg:table-cell…)
  className?: string
}

// A list of cards on phones and a table from md up. `renderCard` lays out the phone card;
// `actions` (a menu or buttons) goes in the card's top-right corner and the last column
export function ResponsiveList<T>({
  items,
  getKey,
  columns,
  renderCard,
  actions,
  isLoading,
  empty,
  onSelect,
}: {
  items?: T[]
  getKey: (item: T) => string | number
  columns: Column<T>[]
  renderCard: (item: T) => ReactNode
  actions?: (item: T) => ReactNode
  isLoading: boolean
  empty: ReactNode
  onSelect?: (item: T) => void
}) {
  const span = columns.length + (actions ? 1 : 0)
  const isEmpty = !isLoading && items?.length === 0

  return (
    <>
      <div className="flex flex-col gap-3 md:hidden">
        {isLoading &&
          Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-24 w-full rounded-xl" />)}
        {isEmpty && (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">{empty}</p>
        )}
        {items?.map((item) => (
          <Card
            key={getKey(item)}
            size="sm"
            className={cn(onSelect && "cursor-pointer transition-colors active:bg-muted/50")}
            onClick={onSelect && (() => onSelect(item))}
          >
            <CardContent className="flex items-start gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-2">{renderCard(item)}</div>
              {actions && (
                <div className="-mt-1 -mr-2 shrink-0" onClick={(event) => event.stopPropagation()}>
                  {actions(item)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden rounded-xl border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="w-12">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }, (_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={span}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            {isEmpty && (
              <TableRow>
                <TableCell colSpan={span} className="h-24 text-center text-muted-foreground">
                  {empty}
                </TableCell>
              </TableRow>
            )}
            {items?.map((item) => (
              <TableRow
                key={getKey(item)}
                className={cn(onSelect && "cursor-pointer")}
                onClick={onSelect && (() => onSelect(item))}
              >
                {columns.map((column, index) => (
                  <TableCell key={index} className={column.className}>
                    {column.cell(item)}
                  </TableCell>
                ))}
                {actions && <TableCell onClick={(event) => event.stopPropagation()}>{actions(item)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

// A label/value row inside a phone card
export function CardField({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3 text-sm", className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right tabular-nums">{children}</span>
    </div>
  )
}
