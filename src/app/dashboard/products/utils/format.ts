export { formatMoney as formatPrice } from "@/lib/format"

export function isLowStock({ stock_actual, stock_minimo }: { stock_actual: number; stock_minimo: number }) {
  return stock_actual <= stock_minimo
}
