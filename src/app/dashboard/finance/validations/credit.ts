import { z } from "zod"

import { amount, cuenta, money, optionalDate } from "@/app/dashboard/finance/validations/common"

// Mirrors CreateCreditDto
export const creditSchema = z
  .object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio.").max(100, "Máximo 100 caracteres."),
    saldo_capital: money("El saldo de capital"),
    cuota_mensual: money("La cuota mensual"),
    cuota_asignada: amount("La cuota asignada"),
    dia_pago: z.number({ error: "El día de pago es obligatorio." }).int().min(1, "Mínimo 1.").max(31, "Máximo 31."),
  })
  .refine((values) => values.cuota_asignada <= values.cuota_mensual, {
    message: "No puede superar la cuota mensual.",
    path: ["cuota_asignada"],
  })

export type CreditValues = z.infer<typeof creditSchema>

// Mirrors PayInstallmentDto
export const installmentSchema = z.object({
  cuenta,
  monto: money("El monto"),
  abono_capital: amount("El abono a capital").or(z.nan()),
  fecha: optionalDate,
})

export type InstallmentValues = z.infer<typeof installmentSchema>

// Mirrors PrepayCreditDto
export const prepaymentSchema = z.object({
  cuenta,
  monto: money("El monto"),
  fecha: optionalDate,
})

export type PrepaymentValues = z.infer<typeof prepaymentSchema>
