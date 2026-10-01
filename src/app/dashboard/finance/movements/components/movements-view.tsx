"use client"

import { ArrowDownLeft, ArrowUpRight, Banknote, ChevronDown, HandCoins, PiggyBank, Plus, Receipt } from "lucide-react"
import { useState } from "react"

import { FiltersBar } from "@/components/filters-bar"
import { PageHeader } from "@/components/page-header"
import { CardField, ResponsiveList, type Column } from "@/components/responsive-list"
import { TablePagination } from "@/components/table-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "@/hooks/use-session"
import { errorMessage } from "@/lib/api-client"
import { currentPeriod, formatDate, formatMoney } from "@/lib/format"
import { can } from "@/lib/permissions"
import { cn } from "@/lib/utils"
import { PeriodSelect } from "@/app/dashboard/finance/components/period-select"
import { useMovements } from "@/app/dashboard/finance/hooks/useFinanceQueries"
import {
  ContributionDialog,
  ExpenseDialog,
  PayExpenseDialog,
  TransferDialog,
  WithdrawalDialog,
} from "@/app/dashboard/finance/movements/components/movement-dialogs"
import {
  ACCOUNT_LABELS,
  CATEGORY_LABELS,
  MOVEMENT_CATEGORIES,
  type Movement,
  type MovementCategory,
  type MovementStatus,
} from "@/app/dashboard/finance/utils/types"

const PAGE_SIZE = 15
const ALL = "all"

type DialogState =
  | { type: "expense" | "contribution" | "withdrawal" | "transfer" }
  | { type: "pay"; movement: Movement }
  | null

function Amount({ movement }: { movement: Movement }) {
  const income = movement.tipo === "INGRESO"
  return (
    <span className={cn("tabular-nums", income && "text-emerald-600 dark:text-emerald-400")}>
      {income ? "+" : "−"}
      {formatMoney(movement.monto)}
    </span>
  )
}

function StatusBadges({ movement }: { movement: Movement }) {
  return (
    <div className="flex flex-wrap gap-1">
      {movement.estado === "PENDIENTE" && <Badge variant="outline">Pendiente</Badge>}
      {movement.descapitalizacion && <Badge variant="destructive">Descapitalización</Badge>}
    </div>
  )
}

// The ledger: every peso in and out (sales, expenses, installments, owner movements)
export function MovementsView() {
  const { data: session } = useSession()
  const isOwner = can.ownerFinance(session?.user.role)

  const [periodo, setPeriodo] = useState(currentPeriod())
  const [categoria, setCategoria] = useState<MovementCategory | undefined>()
  const [estado, setEstado] = useState<MovementStatus | undefined>()
  const [page, setPage] = useState(1)
  const [dialog, setDialog] = useState<DialogState>(null)
  const close = (open: boolean) => !open && setDialog(null)

  const movements = useMovements({
    page,
    limit: PAGE_SIZE,
    periodo: periodo || undefined,
    categoria,
    estado,
  })

  const actions = (movement: Movement) =>
    movement.estado === "PENDIENTE" && movement.tipo === "EGRESO" ? (
      <Button variant="outline" onClick={() => setDialog({ type: "pay", movement })}>
        <Banknote />
        Pagar
      </Button>
    ) : null

  const columns: Column<Movement>[] = [
    { header: "Fecha", cell: (movement) => formatDate(movement.fecha) },
    {
      header: "Concepto",
      cell: (movement) => (
        <div className="flex max-w-72 flex-col">
          <span className="font-medium">{CATEGORY_LABELS[movement.categoria]}</span>
          {movement.descripcion && (
            <span className="truncate text-xs text-muted-foreground" title={movement.descripcion}>
              {movement.descripcion}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Cuenta",
      className: "hidden lg:table-cell",
      cell: (movement) => (movement.cuenta ? ACCOUNT_LABELS[movement.cuenta] : "—"),
    },
    { header: "Estado", cell: (movement) => <StatusBadges movement={movement} /> },
    { header: "Monto", className: "text-right", cell: (movement) => <Amount movement={movement} /> },
  ]

  const resetPage = () => setPage(1)

  return (
    <>
      <PageHeader
        title="Movimientos"
        description="Todo el dinero que entra y sale del negocio."
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus />
                Nuevo
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-52">
              <DropdownMenuItem onClick={() => setDialog({ type: "expense" })}>
                <Receipt />
                Gasto
              </DropdownMenuItem>
              {isOwner && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setDialog({ type: "contribution" })}>
                    <ArrowDownLeft />
                    Aporte del propietario
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDialog({ type: "withdrawal" })}>
                    <HandCoins />
                    Retiro del propietario
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDialog({ type: "transfer" })}>
                    <PiggyBank />
                    Traslado de reserva
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <FiltersBar
        activeCount={(categoria ? 1 : 0) + (estado ? 1 : 0)}
        primary={<PeriodSelect value={periodo} onChange={(value) => { setPeriodo(value); resetPage() }} allowAll />}
      >
        <Select
          value={categoria ?? ALL}
          onValueChange={(value) => {
            setCategoria(value === ALL ? undefined : (value as MovementCategory))
            resetPage()
          }}
        >
          <SelectTrigger aria-label="Categoría" className="sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas las categorías</SelectItem>
            {MOVEMENT_CATEGORIES.map((value) => (
              <SelectItem key={value} value={value}>
                {CATEGORY_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={estado ?? ALL}
          onValueChange={(value) => {
            setEstado(value === ALL ? undefined : (value as MovementStatus))
            resetPage()
          }}
        >
          <SelectTrigger aria-label="Estado" className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            <SelectItem value="PAGADO">Pagados</SelectItem>
            <SelectItem value="PENDIENTE">Pendientes</SelectItem>
          </SelectContent>
        </Select>
      </FiltersBar>
      {movements.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(movements.error)}
        </p>
      ) : (
        <ResponsiveList
          items={movements.data?.data}
          getKey={(movement) => movement.id}
          isLoading={movements.isPending}
          empty="No hay movimientos con estos filtros."
          columns={columns}
          actions={actions}
          renderCard={(movement) => (
            <>
              <div className="flex items-start justify-between gap-2">
                <span className="flex items-center gap-1.5 font-medium">
                  {movement.tipo === "INGRESO" ? (
                    <ArrowDownLeft className="size-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  )}
                  {CATEGORY_LABELS[movement.categoria]}
                </span>
                <span className="font-semibold">
                  <Amount movement={movement} />
                </span>
              </div>
              {movement.descripcion && <p className="text-sm text-muted-foreground">{movement.descripcion}</p>}
              <CardField label="Fecha">{formatDate(movement.fecha)}</CardField>
              {movement.cuenta && <CardField label="Cuenta">{ACCOUNT_LABELS[movement.cuenta]}</CardField>}
              <StatusBadges movement={movement} />
            </>
          )}
        />
      )}
      {movements.data && (
        <TablePagination
          page={movements.data.meta.page}
          lastPage={movements.data.meta.lastPage}
          total={movements.data.meta.total}
          onPageChange={setPage}
        />
      )}

      <ExpenseDialog key={`expense-${dialog?.type === "expense"}`} open={dialog?.type === "expense"} onOpenChange={close} />
      <PayExpenseDialog
        key={dialog?.type === "pay" ? dialog.movement.id : "pay"}
        movement={dialog?.type === "pay" ? dialog.movement : undefined}
        onOpenChange={close}
      />
      {isOwner && (
        <>
          <ContributionDialog
            key={`contribution-${dialog?.type === "contribution"}`}
            open={dialog?.type === "contribution"}
            onOpenChange={close}
          />
          <WithdrawalDialog
            key={`withdrawal-${dialog?.type === "withdrawal"}`}
            open={dialog?.type === "withdrawal"}
            onOpenChange={close}
          />
          <TransferDialog
            key={`transfer-${dialog?.type === "transfer"}`}
            open={dialog?.type === "transfer"}
            onOpenChange={close}
          />
        </>
      )}
    </>
  )
}
