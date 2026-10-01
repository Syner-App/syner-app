"use client"

import { useState } from "react"

import { PageHeader } from "@/components/page-header"
import { TablePagination } from "@/components/table-pagination"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { errorMessage } from "@/lib/api-client"
import { useAlerts } from "@/app/dashboard/alerts/hooks/useAlerts"
import type { AlertStatus } from "@/app/dashboard/alerts/utils/types"

const PAGE_SIZE = 10

const dateFormat = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Bogota",
})

type StatusFilter = AlertStatus | "TODAS"

// Low-stock alerts: opened when a product reaches its minimum stock, resolved when it
// goes back above it
export function AlertsView() {
  const [estado, setEstado] = useState<StatusFilter>("ACTIVA")
  const [page, setPage] = useState(1)

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
      <Tabs
        value={estado}
        onValueChange={(value) => {
          setEstado(value as StatusFilter)
          setPage(1)
        }}
      >
        <TabsList>
          <TabsTrigger value="ACTIVA">Activas</TabsTrigger>
          <TabsTrigger value="RESUELTA">Resueltas</TabsTrigger>
          <TabsTrigger value="TODAS">Todas</TabsTrigger>
        </TabsList>
      </Tabs>
      {alerts.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(alerts.error)}
        </p>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.isPending &&
                Array.from({ length: 4 }, (_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={4}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))}
              {alerts.data?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No hay alertas.
                  </TableCell>
                </TableRow>
              )}
              {alerts.data?.data.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="whitespace-normal">{alert.descripcion}</TableCell>
                  <TableCell className="tabular-nums">#{alert.product_id}</TableCell>
                  <TableCell>
                    <Badge variant={alert.estado === "ACTIVA" ? "destructive" : "secondary"}>
                      {alert.estado === "ACTIVA" ? "Activa" : "Resuelta"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dateFormat.format(new Date(alert.updatedAt ?? alert.createdAt))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
