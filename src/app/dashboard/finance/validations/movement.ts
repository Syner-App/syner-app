import { z } from "zod"

import { OPERATING_EXPENSES } from "@/app/dashboard/finance/utils/types"
import { cuenta, money, optionalDate, optionalText } from "@/app/dashboard/finance/validations/common"

// Mirrors RegisterExpenseDto: cuenta only when it is paid now
export const expenseSchema = z
  .object({
    categoria: z.enum(OPERATING_EXPENSES, { error: "Elige la categoría." }),
    monto: money("El monto"),
    fecha: optionalDate,
    pagado: z.boolean(),
    cuenta: cuenta.optional(),
    descripcion: optionalText(),
  })
  .refine((values) => !values.pagado || values.cuenta !== undefined, {
    message: "Elige la cuenta con la que se pagó.",
    path: ["cuenta"],
  })

export type ExpenseValues = z.infer<typeof expenseSchema>

// Mirrors PayExpenseDto
export const payExpenseSchema = z.object({ cuenta, fecha: optionalDate })

export type PayExpenseValues = z.infer<typeof payExpenseSchema>

// Mirrors RegisterContributionDto
export const contributionSchema = z.object({
  monto: money("El monto"),
  cuenta,
  fecha: optionalDate,
  descripcion: optionalText(),
})

export type ContributionValues = z.infer<typeof contributionSchema>

// Mirrors TransferReserveDto: cuenta is the origin, or the destination when leaving the reserve
export const transferSchema = z.object({
  monto: money("El monto"),
  cuenta,
  hacia_reserva: z.boolean(),
  fecha: optionalDate,
})

export type TransferValues = z.infer<typeof transferSchema>

// Mirrors RegisterWithdrawalDto: above the distributable profit it needs forzar + motivo
export const withdrawalSchema = z
  .object({
    monto: money("El monto"),
    cuenta,
    fecha: optionalDate,
    descripcion: optionalText(),
    forzar: z.boolean(),
    motivo: optionalText(),
  })
  .refine((values) => !values.forzar || values.motivo.length > 0, {
    message: "Indica el motivo para retirar por encima de la utilidad distribuible.",
    path: ["motivo"],
  })

export type WithdrawalValues = z.infer<typeof withdrawalSchema>

export const reopenSchema = z.object({
  motivo: z.string().trim().min(1, "Indica el motivo.").max(255, "Máximo 255 caracteres."),
})

export type ReopenValues = z.infer<typeof reopenSchema>
