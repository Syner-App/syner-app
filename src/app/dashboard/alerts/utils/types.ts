export type AlertStatus = "ACTIVA" | "RESUELTA"

export interface Alert {
  id: string
  tipo: "STOCK_BAJO"
  estado: AlertStatus
  descripcion: string
  product_id: number
  createdAt: string
  updatedAt?: string
}

export interface AlertFilters {
  page: number
  limit: number
  estado?: AlertStatus
}
