"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function TablePagination({
  page,
  lastPage,
  total,
  onPageChange,
}: {
  page: number
  lastPage: number
  total: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
      <span>
        {total} {total === 1 ? "resultado" : "resultados"}
      </span>
      <div className="flex items-center gap-2">
        <span className="tabular-nums">
          <span className="hidden sm:inline">Página </span>
          {lastPage === 0 ? 0 : page}
          <span className="hidden sm:inline"> de </span>
          <span className="sm:hidden">/</span>
          {lastPage}
        </span>
        <Button
          variant="outline"
          size="icon"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Página siguiente"
          disabled={page >= lastPage}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
