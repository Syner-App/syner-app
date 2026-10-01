"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Banknote, CreditCard, Plus, Zap } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { DateField, FormDialog, MoneyField, NumberField, SelectField, TextField } from "@/components/form-fields"
import { PageHeader } from "@/components/page-header"
import { CardField } from "@/components/responsive-list"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/hooks/use-session"
import { errorMessage } from "@/lib/api-client"
import { formatMoney, today } from "@/lib/format"
import { can } from "@/lib/permissions"
import { useCreateCredit, usePayInstallment, usePrepayCredit } from "@/app/dashboard/finance/hooks/useFinanceMutations"
import { useCredits, useWaterfall } from "@/app/dashboard/finance/hooks/useFinanceQueries"
import { accountOptions, type Credit } from "@/app/dashboard/finance/utils/types"
import {
  creditSchema,
  installmentSchema,
  prepaymentSchema,
  type CreditValues,
  type InstallmentValues,
  type PrepaymentValues,
} from "@/app/dashboard/finance/validations/credit"

type DialogState = { type: "create" } | { type: "installment" | "prepay"; credit: Credit } | null

function CreateCreditDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const create = useCreateCredit()
  const form = useForm<CreditValues>({
    resolver: zodResolver(creditSchema),
    defaultValues: { nombre: "", saldo_capital: NaN, cuota_mensual: NaN, cuota_asignada: NaN, dia_pago: NaN },
  })

  async function onSubmit(values: CreditValues) {
    try {
      await create.mutateAsync(values)
      onOpenChange(false)
    } catch {
      // Shown in the dialog
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Nuevo crédito"
      description="La cuota asignada es la parte de la cuota que paga el negocio."
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={form.formState.isSubmitting}
      error={create.error}
      submitLabel="Crear crédito"
    >
      <TextField control={form.control} name="nombre" label="Nombre" placeholder="Crédito de libre inversión" className="sm:col-span-2" />
      <MoneyField control={form.control} name="saldo_capital" label="Saldo de capital" />
      <MoneyField control={form.control} name="cuota_mensual" label="Cuota mensual" />
      <MoneyField control={form.control} name="cuota_asignada" label="Cuota asignada al negocio" />
      <NumberField control={form.control} name="dia_pago" label="Día de pago" min={1} />
    </FormDialog>
  )
}

function InstallmentDialog({ credit, onOpenChange }: { credit?: Credit; onOpenChange: (open: boolean) => void }) {
  const pay = usePayInstallment()
  const form = useForm<InstallmentValues>({
    resolver: zodResolver(installmentSchema),
    defaultValues: {
      cuenta: "BANCO",
      monto: credit ? credit.cuota_pendiente_periodo || credit.cuota_asignada : NaN,
      abono_capital: NaN,
      fecha: today(),
    },
  })

  async function onSubmit(values: InstallmentValues) {
    if (!credit) return
    try {
      await pay.mutateAsync({ id: credit.id, values })
      onOpenChange(false)
    } catch {
      // Shown in the dialog
    }
  }

  return (
    <FormDialog
      open={credit !== undefined}
      onOpenChange={onOpenChange}
      title="Pagar cuota"
      description={credit ? `${credit.nombre} · pendiente del mes ${formatMoney(credit.cuota_pendiente_periodo)}` : undefined}
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={form.formState.isSubmitting}
      error={pay.error}
      submitLabel="Pagar cuota"
    >
      <MoneyField control={form.control} name="monto" label="Monto" />
      <SelectField control={form.control} name="cuenta" label="Pagar desde" options={accountOptions} />
      <MoneyField
        control={form.control}
        name="abono_capital"
        label="Abono a capital (opcional)"
        description="Parte de la cuota que baja el capital."
      />
      <DateField control={form.control} name="fecha" label="Fecha" />
    </FormDialog>
  )
}

function PrepayDialog({ credit, onOpenChange }: { credit?: Credit; onOpenChange: (open: boolean) => void }) {
  const prepay = usePrepayCredit()
  const waterfall = useWaterfall()
  const form = useForm<PrepaymentValues>({
    resolver: zodResolver(prepaymentSchema),
    defaultValues: { cuenta: "BANCO", monto: NaN, fecha: today() },
  })

  async function onSubmit(values: PrepaymentValues) {
    if (!credit) return
    try {
      await prepay.mutateAsync({ id: credit.id, values })
      onOpenChange(false)
    } catch {
      // Shown in the dialog
    }
  }

  const available = waterfall.data?.disponible_abono

  return (
    <FormDialog
      open={credit !== undefined}
      onOpenChange={onOpenChange}
      title="Abono extraordinario"
      description={
        available != null
          ? `Disponible para abonos: ${formatMoney(available)}. Sugerido: ${formatMoney(waterfall.data?.sugerido_abono ?? 0)}.`
          : "Solo con el capital de trabajo cubierto y la reserva completa."
      }
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={form.formState.isSubmitting}
      error={prepay.error}
      submitLabel="Abonar"
    >
      <MoneyField control={form.control} name="monto" label="Monto" />
      <SelectField control={form.control} name="cuenta" label="Pagar desde" options={accountOptions} />
      <DateField control={form.control} name="fecha" label="Fecha" />
    </FormDialog>
  )
}

function CreditCardItem({
  credit,
  canPrepay,
  prepayBlocked,
  onInstallment,
  onPrepay,
}: {
  credit: Credit
  canPrepay: boolean
  prepayBlocked: boolean
  onInstallment: () => void
  onPrepay: () => void
}) {
  const paid = credit.cuota_asignada > 0 ? Math.min(100, (credit.cuota_pagada_periodo / credit.cuota_asignada) * 100) : 100
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="size-4" />
          {credit.nombre}
        </CardTitle>
        <CardDescription>Paga el día {credit.dia_pago} de cada mes</CardDescription>
        <CardAction>{credit.activo ? <Badge variant="secondary">Activo</Badge> : <Badge variant="outline">Pagado</Badge>}</CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="text-2xl font-semibold tabular-nums">{formatMoney(credit.saldo_capital)}</div>
        <p className="-mt-1 text-xs text-muted-foreground">Saldo de capital</p>
        <CardField label="Cuota mensual">{formatMoney(credit.cuota_mensual)}</CardField>
        <CardField label="Asignada al negocio">{formatMoney(credit.cuota_asignada)}</CardField>
        <div className="flex flex-col gap-1.5 pt-1">
          <CardField label="Pagado este mes">
            {formatMoney(credit.cuota_pagada_periodo)}
            {credit.cuota_pendiente_periodo > 0 && (
              <span className="text-muted-foreground"> · faltan {formatMoney(credit.cuota_pendiente_periodo)}</span>
            )}
          </CardField>
          <Progress value={paid} />
        </div>
      </CardContent>
      {credit.activo && (
        <CardFooter className="flex flex-col gap-2 border-t pt-3 sm:flex-row [&>button]:w-full sm:[&>button]:w-auto">
          <Button onClick={onInstallment}>
            <Banknote />
            Pagar cuota
          </Button>
          {canPrepay && (
            <Button
              variant="outline"
              disabled={prepayBlocked}
              title={prepayBlocked ? "No hay dinero disponible para abonos extraordinarios" : undefined}
              onClick={onPrepay}
            >
              <Zap />
              Abono extraordinario
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

// The business credit: monthly installments and, with surplus, extraordinary prepayments
export function CreditsView() {
  const { data: session } = useSession()
  const isOwner = can.ownerFinance(session?.user.role)
  const credits = useCredits()
  const waterfall = useWaterfall()
  const [dialog, setDialog] = useState<DialogState>(null)
  const close = (open: boolean) => !open && setDialog(null)

  return (
    <>
      <PageHeader
        title="Créditos"
        description="Cuotas del mes y abonos extraordinarios cuando hay excedente."
        actions={
          isOwner && (
            <Button onClick={() => setDialog({ type: "create" })}>
              <Plus />
              Nuevo crédito
            </Button>
          )
        }
      />
      {credits.isError && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(credits.error)}
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {credits.isPending && Array.from({ length: 2 }, (_, index) => <Skeleton key={index} className="h-72 rounded-xl" />)}
        {credits.data?.data.map((credit) => (
          <CreditCardItem
            key={credit.id}
            credit={credit}
            canPrepay={isOwner}
            prepayBlocked={waterfall.data ? !waterfall.data.abono_permitido : false}
            onInstallment={() => setDialog({ type: "installment", credit })}
            onPrepay={() => setDialog({ type: "prepay", credit })}
          />
        ))}
      </div>
      {credits.data?.data.length === 0 && (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No hay créditos registrados.
        </p>
      )}

      {isOwner && (
        <CreateCreditDialog key={`create-${dialog?.type === "create"}`} open={dialog?.type === "create"} onOpenChange={close} />
      )}
      <InstallmentDialog
        key={dialog?.type === "installment" ? dialog.credit.id : "installment"}
        credit={dialog?.type === "installment" ? dialog.credit : undefined}
        onOpenChange={close}
      />
      <PrepayDialog
        key={dialog?.type === "prepay" ? dialog.credit.id : "prepay"}
        credit={dialog?.type === "prepay" ? dialog.credit : undefined}
        onOpenChange={close}
      />
    </>
  )
}
