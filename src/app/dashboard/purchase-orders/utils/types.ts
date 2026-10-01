export const PURCHASE_ORDER_STATUSES = ["EN_VALIDACION", "PENDIENTE", "APROBADA", "RECHAZADA", "RECIBIDA"] as const

export type PurchaseOrderStatus = (typeof PURCHASE_ORDER_STATUSES)[number]

// EN_VALIDACION and PENDIENTE are set by the purchase order saga only
export type UpdatablePurchaseOrderStatus = "APROBADA" | "RECHAZADA" | "RECIBIDA"

export const STATUS_LABELS: Record<PurchaseOrderStatus, string> = {
  EN_VALIDACION: "En validación",
  PENDIENTE: "Pendiente",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
  RECIBIDA: "Recibida",
}

export const STATUS_VARIANTS: Record<PurchaseOrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  EN_VALIDACION: "outline",
  PENDIENTE: "secondary",
  APROBADA: "default",
  RECHAZADA: "destructive",
  RECIBIDA: "outline",
}

export interface PurchaseOrder {
  id: string
  estado: PurchaseOrderStatus
  proveedor: string
  cantidad_solicitada: number
  motivo?: string
  producto_id: number
  createdAt: string
  updatedAt?: string
}

export interface PurchaseOrderFilters {
  page: number
  limit: number
  estado?: PurchaseOrderStatus
}
