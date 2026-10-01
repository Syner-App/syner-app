import { z } from "zod"

import { CASH_ACCOUNTS } from "@/app/dashboard/finance/utils/types"

// Building blocks that mirror the class-validator rules of client-gateway's finance DTOs.
// Number inputs send NaN when empty, which zod reports with the `error` message

export const money = (label: string) =>
  z
    .number({ error: `${label} es obligatorio.` })
    .int(`${label} debe ser un valor entero.`)
    .positive(`${label} debe ser mayor a 0.`)

export const amount = (label: string) =>
  z
    .number({ error: `${label} es obligatorio.` })
    .int(`${label} debe ser un valor entero.`)
    .min(0, `${label} no puede ser negativo.`)

// Up to 4 decimals (0.05 bags of ice per granizado)
export const quantity = (label: string) =>
  z
    .number({ error: `${label} es obligatoria.` })
    .positive(`${label} debe ser mayor a 0.`)
    .refine((value) => Math.abs(value * 10_000 - Math.round(value * 10_000)) < 1e-6, {
      message: `${label} admite máximo 4 decimales.`,
    })

export const cuenta = z.enum(CASH_ACCOUNTS as ["CAJA", "BANCO"], { error: "Elige la cuenta." })

// "" = not sent (the backend uses today)
export const optionalDate = z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida.")])

export const optionalText = (max = 255) => z.string().trim().max(max, `Máximo ${max} caracteres.`)
