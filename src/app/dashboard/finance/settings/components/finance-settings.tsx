"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Lock, LockOpen } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { DateField, FormDialog, MoneyField, NumberField, TextField } from "@/components/form-fields"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/hooks/use-session"
import { errorMessage } from "@/lib/api-client"
import { formatMoney, formatPeriod, recentPeriods, today } from "@/lib/format"
import { can } from "@/lib/permissions"
import { PeriodSelect } from "@/app/dashboard/finance/components/period-select"
import {
  useClosePeriod,
  useReopenPeriod,
  useSetAssumptions,
  useUpdatePolicy,
} from "@/app/dashboard/finance/hooks/useFinanceMutations"
import { useAssumptions, usePolicy } from "@/app/dashboard/finance/hooks/useFinanceQueries"
import { CATEGORY_LABELS, OPERATING_EXPENSES, type Assumptions, type Policy } from "@/app/dashboard/finance/utils/types"
import { assumptionsSchema, type AssumptionsValues } from "@/app/dashboard/finance/validations/assumptions"
import { reopenSchema, type ReopenValues } from "@/app/dashboard/finance/validations/movement"
import { policySchema, type PolicyValues } from "@/app/dashboard/finance/validations/policy"

function SubmitButton({ isSubmitting, children }: { isSubmitting: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
      {isSubmitting && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  )
}

// A new version of the assumptions takes effect from vigente_desde (today by default)
function AssumptionsForm({ assumptions }: { assumptions: Assumptions | null }) {
  const save = useSetAssumptions()
  const form = useForm<AssumptionsValues>({
    resolver: zodResolver(assumptionsSchema),
    defaultValues: {
      vigente_desde: today(),
      precio_promedio: assumptions?.precio_promedio ?? NaN,
      costo_variable_unitario: assumptions?.costo_variable_unitario ?? NaN,
      arriendo: assumptions?.arriendo ?? NaN,
      servicios: assumptions?.servicios ?? NaN,
      salarios: assumptions?.salarios ?? NaN,
      otros_fijos: assumptions?.otros_fijos ?? NaN,
      dias_operacion: assumptions?.dias_operacion ?? 26,
      inversion_inicial: assumptions?.inversion_inicial ?? NaN,
    },
  })

  async function onSubmit(values: AssumptionsValues) {
    try {
      await save.mutateAsync(values)
    } catch {
      // Shown below
    }
  }

  return (
    <Card size="sm">
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <CardHeader>
          <CardTitle>Supuestos del negocio</CardTitle>
          <CardDescription>
            {assumptions
              ? `Vigentes desde ${assumptions.vigente_desde} · costos fijos ${formatMoney(assumptions.costos_fijos)} al mes.`
              : "Base del punto de equilibrio, los escenarios y la recuperación de la inversión."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <MoneyField control={form.control} name="precio_promedio" label="Precio promedio de venta" />
            <MoneyField
              control={form.control}
              name="costo_variable_unitario"
              label="Costo variable unitario"
              description="Vacío: se calcula de los productos."
            />
            <NumberField control={form.control} name="dias_operacion" label="Días de operación al mes" min={1} />
            <MoneyField control={form.control} name="arriendo" label="Arriendo" />
            <MoneyField control={form.control} name="servicios" label="Servicios" />
            <MoneyField control={form.control} name="salarios" label="Salarios" />
            <MoneyField control={form.control} name="otros_fijos" label="Otros fijos" />
            <MoneyField control={form.control} name="inversion_inicial" label="Inversión inicial" />
            <DateField control={form.control} name="vigente_desde" label="Vigentes desde" />
          </FieldGroup>
          {save.isError && <FieldError className="mt-4">{errorMessage(save.error)}</FieldError>}
        </CardContent>
        <CardFooter className="justify-end border-t pt-3">
          <SubmitButton isSubmitting={form.formState.isSubmitting}>Guardar supuestos</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  )
}

// Only the owner changes the policy; an admin sees it read-only
function PolicyForm({ policy, editable }: { policy: Policy; editable: boolean }) {
  const save = useUpdatePolicy()
  const form = useForm<PolicyValues>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      dias_cobertura: policy.dias_cobertura,
      meses_reserva: policy.meses_reserva,
      porcentaje_retiro: policy.porcentaje_retiro,
      niveles_escenario: policy.niveles_escenario,
      categorias_variables: policy.categorias_variables.filter((category) =>
        (OPERATING_EXPENSES as readonly string[]).includes(category)
      ) as PolicyValues["categorias_variables"],
    },
    disabled: !editable,
  })
  const [levelsText, setLevelsText] = useState(policy.niveles_escenario.join(", "))

  async function onSubmit(values: PolicyValues) {
    try {
      await save.mutateAsync(values)
    } catch {
      // Shown below
    }
  }

  return (
    <Card size="sm">
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <CardHeader>
          <CardTitle>Política financiera</CardTitle>
          <CardDescription>
            {editable ? "Cuánto dejar en el negocio y cómo repartir el excedente." : "Solo el propietario puede cambiarla."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-4 sm:grid-cols-3">
            <NumberField
              control={form.control}
              name="dias_cobertura"
              label="Días de cobertura"
              description="Capital de trabajo a mantener."
            />
            <NumberField
              control={form.control}
              name="meses_reserva"
              label="Meses de reserva"
              decimal
              description="Meta de reserva en costos fijos."
            />
            <NumberField
              control={form.control}
              name="porcentaje_retiro"
              label="% del excedente para retiros"
              description="El resto se sugiere para abonos."
            />
            <Controller
              name="niveles_escenario"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="sm:col-span-3">
                  <FieldLabel htmlFor="policy-levels">Niveles de escenarios (unidades por día)</FieldLabel>
                  <Input
                    id="policy-levels"
                    inputMode="numeric"
                    placeholder="30, 50, 100"
                    disabled={field.disabled}
                    value={levelsText}
                    onChange={(event) => {
                      setLevelsText(event.target.value)
                      field.onChange(
                        event.target.value
                          .split(/[,\s]+/)
                          .map(Number)
                          .filter((level) => Number.isInteger(level) && level > 0)
                      )
                    }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="categorias_variables"
              control={form.control}
              render={({ field }) => (
                <FieldSet className="sm:col-span-3">
                  <FieldLegend variant="label">Gastos que cuentan como costo variable</FieldLegend>
                  <FieldDescription>El resto de categorías se tratan como gastos fijos.</FieldDescription>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {OPERATING_EXPENSES.map((category) => {
                      const checked = field.value.includes(category)
                      return (
                        <Label
                          key={category}
                          className="flex items-center gap-2 rounded-lg border p-3 font-normal has-data-[state=checked]:border-primary"
                        >
                          <Checkbox
                            checked={checked}
                            disabled={field.disabled}
                            onCheckedChange={(next) =>
                              field.onChange(
                                next ? [...field.value, category] : field.value.filter((value) => value !== category)
                              )
                            }
                          />
                          {CATEGORY_LABELS[category]}
                        </Label>
                      )
                    })}
                  </div>
                </FieldSet>
              )}
            />
          </FieldGroup>
          {save.isError && <FieldError className="mt-4">{errorMessage(save.error)}</FieldError>}
        </CardContent>
        {editable && (
          <CardFooter className="justify-end border-t pt-3">
            <SubmitButton isSubmitting={form.formState.isSubmitting}>Guardar política</SubmitButton>
          </CardFooter>
        )}
      </form>
    </Card>
  )
}

// Closing a period freezes its movements; reopening asks for a reason (owner only)
function PeriodsCard() {
  const [periodo, setPeriodo] = useState(recentPeriods(2)[1])
  const [action, setAction] = useState<"close" | "reopen" | null>(null)
  const closePeriod = useClosePeriod()
  const reopenPeriod = useReopenPeriod()
  const form = useForm<ReopenValues>({ resolver: zodResolver(reopenSchema), defaultValues: { motivo: "" } })

  async function onReopen({ motivo }: ReopenValues) {
    try {
      await reopenPeriod.mutateAsync({ periodo, motivo })
      form.reset()
      setAction(null)
    } catch {
      // Shown in the dialog
    }
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Cierre de periodos</CardTitle>
        <CardDescription>Un periodo cerrado no admite movimientos hasta reabrirlo.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <PeriodSelect value={periodo} onChange={setPeriodo} />
        <div className="flex gap-2 *:flex-1 sm:*:flex-none">
          <Button variant="outline" onClick={() => setAction("close")}>
            <Lock />
            Cerrar
          </Button>
          <Button variant="outline" onClick={() => setAction("reopen")}>
            <LockOpen />
            Reabrir
          </Button>
        </div>
      </CardContent>
      <ConfirmDialog
        open={action === "close"}
        destructive={false}
        title={`¿Cerrar ${formatPeriod(periodo)}?`}
        description="Sus movimientos quedan congelados para los reportes."
        confirmLabel="Cerrar periodo"
        isPending={closePeriod.isPending}
        onConfirm={() =>
          closePeriod.mutateAsync(periodo).catch((error: unknown) => {
            toast.error(errorMessage(error))
            throw error
          })
        }
        onOpenChange={(open) => !open && setAction(null)}
      />
      <FormDialog
        open={action === "reopen"}
        onOpenChange={(open) => !open && setAction(null)}
        title={`Reabrir ${formatPeriod(periodo)}`}
        onSubmit={form.handleSubmit(onReopen)}
        isSubmitting={form.formState.isSubmitting}
        error={reopenPeriod.error}
        submitLabel="Reabrir"
      >
        <TextField control={form.control} name="motivo" label="Motivo" className="sm:col-span-2" multiline />
      </FormDialog>
    </Card>
  )
}

export function FinanceSettings() {
  const { data: session } = useSession()
  const isOwner = can.ownerFinance(session?.user.role)
  const assumptions = useAssumptions()
  const policy = usePolicy()

  return (
    <>
      <PageHeader title="Configuración financiera" description="Supuestos, política y cierre de periodos." />
      {assumptions.isError && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(assumptions.error)}
        </p>
      )}
      {assumptions.isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        assumptions.data !== undefined && (
          <AssumptionsForm key={assumptions.data?.id ?? "new"} assumptions={assumptions.data} />
        )
      )}
      {policy.isError && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(policy.error)}
        </p>
      )}
      {policy.data ? <PolicyForm key={JSON.stringify(policy.data)} policy={policy.data} editable={isOwner} /> : policy.isPending && <Skeleton className="h-72 w-full" />}
      {isOwner && <PeriodsCard />}
    </>
  )
}
