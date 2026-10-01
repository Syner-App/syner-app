"use client"

import { SlidersHorizontal } from "lucide-react"
import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// Filters of a list. On phones `primary` (usually the search) stays visible and the rest
// opens in a bottom sheet behind a "Filtros" button; from md up everything is inline
export function FiltersBar({
  primary,
  children,
  activeCount = 0,
}: {
  primary?: ReactNode
  children?: ReactNode
  // Filters in `children` that differ from their default, shown on the button
  activeCount?: number
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
      {primary && <div className="flex min-w-0 flex-1 gap-2 md:max-w-xs md:flex-none">{primary}</div>}
      {children && (
        <>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full md:hidden">
                <SlidersHorizontal />
                Filtros
                {activeCount > 0 && <Badge className="ml-1">{activeCount}</Badge>}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-xl md:hidden">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription className="sr-only">Ajusta los filtros de la lista</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4 pb-6 [&_[data-slot=select-trigger]]:w-full">{children}</div>
            </SheetContent>
          </Sheet>
          <div className="hidden flex-wrap items-center gap-3 md:flex">{children}</div>
        </>
      )}
    </div>
  )
}
