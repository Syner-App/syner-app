"use client"

import { useState } from "react"

import { FilterTabs } from "@/components/filter-tabs"
import { PageHeader } from "@/components/page-header"
import { ResponsiveList } from "@/components/responsive-list"
import { TablePagination } from "@/components/table-pagination"
import { Badge } from "@/components/ui/badge"
import { errorMessage } from "@/lib/api-client"
import { useAlerts } from "@/app/dashboard/alerts/hooks/useAlerts"
import type { Alert, AlertStatus } from "@/app/dashboard/alerts/utils/types"
import { useProductLookup } from "@/app/dashboard/products/hooks/useProductLookup"

const PAGE_SIZE = 10

const dateFormat = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Bogota",
})

type StatusFilter = AlertStatus | "TODAS"

function StatusBadge({ alert }: { alert: Alert }) {
  return (
    <Badge variant={alert.estado === "ACTIVA" ? "destructive" : "secondary"}>
      {alert.estado === "ACTIVA" ? "Activa" : "Resuelta"}
    </Badge>
  )
}

// Low-stock alerts: opened when a product reaches its minimum stock, resolved when it
// goes back above it
export function AlertsView() {
  const [estado, setEstado] = useState<StatusFilter>("ACTIVA")
  const [page, setPage] = useState(1)
  const { nameOf } = useProductLookup()

  const alerts = useAlerts({
    page,
    limit: PAGE_SIZE,
    estado: estado === "TODAS" ? undefined : estado,
  })

  return (
    <>
      <PageHeader
        title="Alertas"
        description="Se abren cuando un producto llega a su stock mínimo y se resuelven al reponerlo."
      />
      <FilterTabs
        value={estado}
        options={[
          { value: "ACTIVA", label: "Activas" },
          { value: "RESUELTA", label: "Resueltas" },
          { value: "TODAS", label: "Todas" },
        ]}
        onChange={(value) => {
          setEstado(value)
          setPage(1)
        }}
      />
      {alerts.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(alerts.error)}
        </p>
      ) : (
        <ResponsiveList
          items={alerts.data?.data}
          getKey={(alert) => alert.id}
          isLoading={alerts.isPending}
          empty="No hay alertas."
          columns={[
            { header: "Descripción", className: "whitespace-normal", cell: (alert) => alert.descripcion },
            { header: "Producto", cell: (alert) => nameOf(alert.product_id) },
            { header: "Estado", cell: (alert) => <StatusBadge alert={alert} /> },
            {
              header: "Fecha",
              className: "text-muted-foreground",
              cell: (alert) => dateFormat.format(new Date(alert.updatedAt ?? alert.createdAt)),
            },
          ]}
          renderCard={(alert) => (
            <>
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium">{nameOf(alert.product_id)}</span>
                <StatusBadge alert={alert} />
              </div>
              <p className="text-sm">{alert.descripcion}</p>
              <span className="text-xs text-muted-foreground">
                {dateFormat.format(new Date(alert.updatedAt ?? alert.createdAt))}
              </span>
            </>
          )}
        />
      )}
      {alerts.data && (
        <TablePagination
          page={alerts.data.meta.page}
          lastPage={alerts.data.meta.lastPage}
          total={alerts.data.meta.total}
          onPageChange={setPage}
        />
      )}
    </>
  )
}
