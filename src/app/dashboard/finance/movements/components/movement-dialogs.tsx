"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"

import { DateField, FormDialog, MoneyField, SelectField, SwitchField, TextField } from "@/components/form-fields"
import { formatMoney, today } from "@/lib/format"
import {
  usePayExpense,
  useRegisterContribution,
  useRegisterExpense,
  useRegisterWithdrawal,
  useTransferReserve,
} from "@/app/dashboard/finance/hooks/useFinanceMutations"
import { useWaterfall } from "@/app/dashboard/finance/hooks/useFinanceQueries"
import { CATEGORY_LABELS, accountOptions, expenseOptions, type Movement } from "@/app/dashboard/finance/utils/types"
import {
  contributionSchema,
  expenseSchema,
  payExpenseSchema,
  transferSchema,
  withdrawalSchema,
  type ContributionValues,
  type ExpenseValues,
  type PayExpenseValues,
  type TransferValues,
  type WithdrawalValues,
} from "@/app/dashboard/finance/validations/movement"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Runs the mutation, then closes; a failure stays in the dialog (FormDialog shows it)
async function submitAndClose(run: () => Promise<unknown>, onOpenChange: (open: boolean) => void) {
  try {
    await run()
    onOpenChange(false)
  } catch {
    // Shown in the dialog
  }
}

export function ExpenseDialog({ open, onOpenChange }: DialogProps) {
  const register = useRegisterExpense()
  const form = useForm<ExpenseValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { categoria: undefined, monto: NaN, fecha: today(), pagado: true, cuenta: "CAJA", descripcion: "" },
  })
  const pagado = useWatch({ control: form.control, name: "pagado" })

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Registrar gasto"
      description="Un gasto sin pagar queda pendiente y se paga después desde la lista."
      onSubmit={form.handleSubmit((values) =>
        submitAndClose(
          () => register.mutateAsync({ ...values, cuenta: values.pagado ? values.cuenta : undefined }),
          onOpenChange
        )
      )}
      isSubmitting={form.formState.isSubmitting}
      error={register.error}
      submitLabel="Registrar"
    >
      <SelectField control={form.control} name="categoria" label="Categoría" options={expenseOptions} />
      <MoneyField control={form.control} name="monto" label="Monto" />
      <DateField control={form.control} name="fecha" label="Fecha" />
      <SwitchField control={form.control} name="pagado" label="Ya está pagado" className="self-end pb-2" />
      {pagado && <SelectField control={form.control} name="cuenta" label="Pagado desde" options={accountOptions} />}
      <TextField control={form.control} name="descripcion" label="Descripción (opcional)" className="sm:col-span-2" />
    </FormDialog>
  )
}

export function PayExpenseDialog({ movement, onOpenChange }: { movement?: Movement; onOpenChange: (open: boolean) => void }) {
  const pay = usePayExpense()
  const form = useForm<PayExpenseValues>({
    resolver: zodResolver(payExpenseSchema),
    defaultValues: { cuenta: "CAJA", fecha: today() },
  })

  return (
    <FormDialog
      open={movement !== undefined}
      onOpenChange={onOpenChange}
      title="Pagar gasto"
      description={movement ? `${CATEGORY_LABELS[movement.categoria]} · ${formatMoney(movement.monto)}` : undefined}
      onSubmit={form.handleSubmit((values) =>
        submitAndClose(async () => {
          if (movement) await pay.mutateAsync({ id: movement.id, values })
        }, onOpenChange)
      )}
      isSubmitting={form.formState.isSubmitting}
      error={pay.error}
      submitLabel="Pagar"
    >
      <SelectField control={form.control} name="cuenta" label="Pagar desde" options={accountOptions} />
      <DateField control={form.control} name="fecha" label="Fecha de pago" />
    </FormDialog>
  )
}

export function ContributionDialog({ open, onOpenChange }: DialogProps) {
  const register = useRegisterContribution()
  const form = useForm<ContributionValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: { monto: NaN, cuenta: "BANCO", fecha: today(), descripcion: "" },
  })

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Registrar aporte"
      description="Dinero que el propietario pone en el negocio."
      onSubmit={form.handleSubmit((values) => submitAndClose(() => register.mutateAsync(values), onOpenChange))}
      isSubmitting={form.formState.isSubmitting}
      error={register.error}
      submitLabel="Registrar"
    >
      <MoneyField control={form.control} name="monto" label="Monto" />
      <SelectField control={form.control} name="cuenta" label="Ingresa a" options={accountOptions} />
      <DateField control={form.control} name="fecha" label="Fecha" />
      <TextField control={form.control} name="descripcion" label="Descripción (opcional)" />
    </FormDialog>
  )
}

export function TransferDialog({ open, onOpenChange }: DialogProps) {
  const transfer = useTransferReserve()
  const form = useForm<TransferValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: { monto: NaN, cuenta: "BANCO", hacia_reserva: true, fecha: today() },
  })
  const toReserve = useWatch({ control: form.control, name: "hacia_reserva" })

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Traslado de reserva"
      description="La reserva es dinero apartado: no cuenta como efectivo operativo."
      onSubmit={form.handleSubmit((values) => submitAndClose(() => transfer.mutateAsync(values), onOpenChange))}
      isSubmitting={form.formState.isSubmitting}
      error={transfer.error}
      submitLabel="Trasladar"
    >
      <SwitchField
        control={form.control}
        name="hacia_reserva"
        label={toReserve ? "Hacia la reserva" : "Desde la reserva"}
        description={toReserve ? "Aparta dinero de caja o banco." : "Devuelve dinero de la reserva a caja o banco."}
        className="sm:col-span-2"
      />
      <MoneyField control={form.control} name="monto" label="Monto" />
      <SelectField control={form.control} name="cuenta" label={toReserve ? "Desde" : "Hacia"} options={accountOptions} />
      <DateField control={form.control} name="fecha" label="Fecha" />
    </FormDialog>
  )
}

export function WithdrawalDialog({ open, onOpenChange }: DialogProps) {
  const register = useRegisterWithdrawal()
  const waterfall = useWaterfall()
  const form = useForm<WithdrawalValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: { monto: NaN, cuenta: "BANCO", fecha: today(), descripcion: "", forzar: false, motivo: "" },
  })
  const [forzar, monto] = useWatch({ control: form.control, name: ["forzar", "monto"] })
  const distributable = waterfall.data?.utilidad_distribuible
  const above = distributable != null && !Number.isNaN(monto) && monto > distributable

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Registrar retiro"
      description={
        distributable != null
          ? `Utilidad distribuible: ${formatMoney(distributable)}. Sugerido: ${formatMoney(waterfall.data?.sugerido_retiro ?? 0)}.`
          : "Dinero que el propietario saca del negocio."
      }
      onSubmit={form.handleSubmit((values) => submitAndClose(() => register.mutateAsync(values), onOpenChange))}
      isSubmitting={form.formState.isSubmitting}
      error={register.error}
      submitLabel="Registrar retiro"
      destructive={forzar}
    >
      <MoneyField control={form.control} name="monto" label="Monto" />
      <SelectField control={form.control} name="cuenta" label="Sale de" options={accountOptions} />
      <DateField control={form.control} name="fecha" label="Fecha" />
      <TextField control={form.control} name="descripcion" label="Descripción (opcional)" />
      {(above || forzar) && (
        <SwitchField
          control={form.control}
          name="forzar"
          label="Retirar por encima de la utilidad distribuible"
          description="Queda marcado como descapitalización."
          className="sm:col-span-2"
        />
      )}
      {forzar && <TextField control={form.control} name="motivo" label="Motivo" className="sm:col-span-2" multiline />}
    </FormDialog>
  )
}
