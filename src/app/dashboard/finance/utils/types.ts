// finance-ms shapes as client-gateway returns them (generated/proto/finance.ts). Amounts are
// whole pesos; periods are YYYY-MM and dates YYYY-MM-DD

export type Account = "CAJA" | "BANCO" | "RESERVA"
export type CashAccount = Exclude<Account, "RESERVA">

export const CASH_ACCOUNTS: CashAccount[] = ["CAJA", "BANCO"]

export const ACCOUNT_LABELS: Record<Account, string> = {
  CAJA: "Caja",
  BANCO: "Banco",
  RESERVA: "Reserva",
}

export const MOVEMENT_CATEGORIES = [
  "VENTAS",
  "MATERIA_PRIMA",
  "EMPAQUES",
  "TRANSPORTE",
  "SERVICIOS",
  "ARRIENDO",
  "SALARIOS",
  "PUBLICIDAD",
  "OTROS_OPERATIVOS",
  "CUOTA_CREDITO",
  "ABONO_EXTRAORDINARIO",
  "RETIRO_PROPIETARIO",
  "APORTE_PROPIETARIO",
  "TRASLADO_RESERVA",
] as const

export type MovementCategory = (typeof MOVEMENT_CATEGORIES)[number]

// Categories of a registered expense; withdrawals, installments and transfers have their own forms
export const OPERATING_EXPENSES = [
  "MATERIA_PRIMA",
  "EMPAQUES",
  "TRANSPORTE",
  "SERVICIOS",
  "ARRIENDO",
  "SALARIOS",
  "PUBLICIDAD",
  "OTROS_OPERATIVOS",
] as const satisfies readonly MovementCategory[]

export type OperatingExpense = (typeof OPERATING_EXPENSES)[number]

export const SUPPLY_CATEGORIES = ["MATERIA_PRIMA", "EMPAQUES"] as const satisfies readonly MovementCategory[]

export type SupplyCategory = (typeof SUPPLY_CATEGORIES)[number]

export const CATEGORY_LABELS: Record<MovementCategory, string> = {
  VENTAS: "Ventas",
  MATERIA_PRIMA: "Materia prima",
  EMPAQUES: "Empaques",
  TRANSPORTE: "Transporte",
  SERVICIOS: "Servicios",
  ARRIENDO: "Arriendo",
  SALARIOS: "Salarios",
  PUBLICIDAD: "Publicidad",
  OTROS_OPERATIVOS: "Otros operativos",
  CUOTA_CREDITO: "Cuota de crédito",
  ABONO_EXTRAORDINARIO: "Abono extraordinario",
  RETIRO_PROPIETARIO: "Retiro del propietario",
  APORTE_PROPIETARIO: "Aporte del propietario",
  TRASLADO_RESERVA: "Traslado de reserva",
}

export type MovementStatus = "PAGADO" | "PENDIENTE"
export type StockDeductionStatus = "STOCK_PENDIENTE" | "STOCK_APLICADO" | "STOCK_RECHAZADO"
export type PayableStatus = "POR_PAGAR" | "PAGADA"
export type ScenarioResult = "PERDIDA" | "CUBRE_OPERACION" | "GANANCIA"

export const STOCK_STATUS_LABELS: Record<StockDeductionStatus, string> = {
  STOCK_PENDIENTE: "Stock pendiente",
  STOCK_APLICADO: "Stock aplicado",
  STOCK_RECHAZADO: "Stock rechazado",
}

export const SCENARIO_LABELS: Record<ScenarioResult, string> = {
  PERDIDA: "Pérdida",
  CUBRE_OPERACION: "Cubre la operación",
  GANANCIA: "Ganancia",
}

export interface Movement {
  id: string
  tipo: "INGRESO" | "EGRESO"
  categoria: MovementCategory
  monto: number
  periodo: string
  fecha: string
  estado: MovementStatus
  cuenta?: Account
  pagado_en?: string
  descripcion?: string
  descapitalizacion: boolean
  referencia_id?: string
  createdAt: string
}

export interface Supply {
  id: number
  producto_id: number
  nombre: string
  categoria: MovementCategory
  costo_unitario: number
  consumo_pendiente: number
  createdAt: string
  updatedAt?: string
}

export interface RecipeItem {
  supply_id: number
  producto_id: number
  nombre: string
  cantidad: number
  costo: number
}

export interface Recipe {
  id: number
  nombre: string
  precio_venta: number
  activo: boolean
  costo_unitario: number
  margen_unitario: number
  items: RecipeItem[]
}

export interface SaleLine {
  recipe_id: number
  nombre: string
  unidades: number
  precio_unitario: number
  costo_unitario: number
  subtotal: number
}

export interface Sale {
  id: string
  fecha: string
  periodo: string
  cuenta: Account
  total: number
  costo_total: number
  estado_stock: StockDeductionStatus
  motivo_rechazo?: string
  lineas: SaleLine[]
  consumos: { producto_id: number; cantidad: number }[]
  createdAt: string
}

export interface Payable {
  id: string
  purchase_order_id: string
  producto_id: number
  supply_id?: number
  nombre?: string
  cantidad: number
  // unset: the supply has no cost yet
  monto_estimado?: number
  monto_real?: number
  estado: PayableStatus
  fecha_recepcion: string
  periodo: string
  pagada_en?: string
  createdAt: string
}

export interface Credit {
  id: string
  nombre: string
  saldo_capital: number
  cuota_mensual: number
  // part of the installment the business pays
  cuota_asignada: number
  dia_pago: number
  activo: boolean
  cuota_pagada_periodo: number
  cuota_pendiente_periodo: number
  createdAt: string
}

export interface Assumptions {
  id: string
  vigente_desde: string
  precio_promedio: number
  // unset: computed from the recipes
  costo_variable_unitario?: number
  arriendo: number
  servicios: number
  salarios: number
  otros_fijos: number
  dias_operacion: number
  inversion_inicial: number
  costos_fijos: number
}

export interface Policy {
  dias_cobertura: number
  meses_reserva: number
  porcentaje_retiro: number
  niveles_escenario: number[]
  categorias_variables: MovementCategory[]
}

export interface Period {
  periodo: string
  estado: "ABIERTO" | "CERRADO"
  cerrado_en?: string
  reabierto_motivo?: string
}

export interface IncomeStatement {
  periodo: string
  cerrado: boolean
  ventas: number
  costos_variables: number
  margen_contribucion: number
  gastos_fijos: number
  utilidad_operativa: number
  cuota_credito: number
  flujo_disponible: number
  costo_de_lo_vendido: number
  unidades_vendidas: number
  detalle: { categoria: MovementCategory; monto: number }[]
  cuentas_sin_valorar: number
}

export interface ReplenishmentItem {
  producto_id: number
  nombre: string
  stock_actual: number
  stock_minimo: number
  en_ordenes_abiertas: number
  consumo_diario: number
  necesidad: number
  faltante: number
  valor: number
}

export interface Waterfall {
  efectivo_caja: number
  efectivo_banco: number
  efectivo_operativo: number
  cuentas_por_pagar: number
  gastos_pendientes: number
  compromisos_compra: number
  pendientes: number
  reposicion_inventario: number
  cuota_pendiente: number
  capital_trabajo: number
  reserva_meta: number
  reserva_acumulada: number
  faltante_reserva: number
  excedente: number
  deficit: number
  utilidades_no_distribuidas: number
  utilidad_distribuible: number
  disponible_abono: number
  abono_permitido: boolean
  sugerido_retiro: number
  sugerido_abono: number
  // products-ms/orders-ms did not answer: replenishment by formula
  inventario_estimado: boolean
  reposicion_detalle: ReplenishmentItem[]
}

export interface BreakEven {
  precio_promedio: number
  costo_variable_unitario: number
  cvu_origen: "RECETAS" | "MANUAL" | string
  margen_contribucion_unitario: number
  razon_contribucion: number
  costos_fijos: number
  dias_operacion: number
  alcanzable: boolean
  pe_unidades?: number
  pe_dinero?: number
  pe_diario?: number
  cuota_asignada: number
  pe_credito_unidades?: number
  pe_credito_dinero?: number
  pe_credito_diario?: number
  mensaje?: string
}

export interface Scenario {
  unidades_diarias: number
  unidades_mes: number
  ventas: number
  costos_variables: number
  gastos_fijos: number
  utilidad_operativa: number
  cuota_credito: number
  flujo_disponible: number
  aporte_reserva: number
  distribuible_estimado: number
  meses_recuperacion?: number
  resultado: ScenarioResult
  insumos: { producto_id: number; nombre: string; cantidad_mensual: number; costo_mensual: number }[]
}

export interface ScenarioList {
  data: Scenario[]
  punto_equilibrio?: BreakEven
}

export interface Recovery {
  inversion_inicial: number
  recuperado: number
  porcentaje?: number
  meses_restantes?: number
}

export interface FinanceAlert {
  codigo: string
  mensaje: string
}

export interface Answers {
  vender_por_dia?: number
  vender_por_dia_con_credito?: number
  utilidad_operativa: number
  flujo_disponible: number
  dejar_en_el_negocio: number
  retiro_maximo: number
  abono_maximo: number
}

export interface Dashboard {
  periodo: string
  estado_resultados?: IncomeStatement
  // unset until the assumptions are registered
  punto_equilibrio?: BreakEven
  cascada?: Waterfall
  recuperacion?: Recovery
  respuestas?: Answers
  alertas: FinanceAlert[]
  inversion_inicial: number
}

export const accountOptions = CASH_ACCOUNTS.map((value) => ({ value, label: ACCOUNT_LABELS[value] }))

export const expenseOptions = OPERATING_EXPENSES.map((value) => ({ value, label: CATEGORY_LABELS[value] }))

export interface SaleFilters {
  page: number
  limit: number
  periodo?: string
  estado_stock?: StockDeductionStatus
}

export interface PayableFilters {
  page: number
  limit: number
  estado?: PayableStatus
}

export interface MovementFilters {
  page: number
  limit: number
  periodo?: string
  categoria?: MovementCategory
  estado?: MovementStatus
}
