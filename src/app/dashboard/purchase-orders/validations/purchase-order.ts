import { z } from "zod"

// Mirrors CreatePurchaseOrderDto in client-gateway
export const purchaseOrderSchema = z.object({
  producto_id: z.number({ error: "Elige un producto." }).int().positive("Elige un producto."),
  proveedor: z.string().trim().min(1, "El proveedor es obligatorio."),
  cantidad_solicitada: z
    .number({ error: "La cantidad es obligatoria." })
    .int("La cantidad debe ser un número entero.")
    .positive("La cantidad debe ser mayor a 0."),
  motivo: z.string().trim(),
})

export type PurchaseOrderValues = z.infer<typeof purchaseOrderSchema>

// Mirrors UpdateStatusPurchaseDto: motivo is required when rejecting
export const rejectSchema = z.object({
  motivo: z.string().trim().min(1, "Indica el motivo del rechazo."),
})

export type RejectValues = z.infer<typeof rejectSchema>
