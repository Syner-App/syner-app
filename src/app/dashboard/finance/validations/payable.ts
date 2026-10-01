import { z } from "zod"

import { cuenta, money, optionalDate } from "@/app/dashboard/finance/validations/common"

// Mirrors PayPayableDto: the real amount becomes the reference cost of the supply
export const payPayableSchema = z.object({
  monto_real: money("El monto de la factura"),
  cuenta,
  fecha: optionalDate,
})

export type PayPayableValues = z.infer<typeof payPayableSchema>
