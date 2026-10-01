const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
})

export function formatPrice(value: number): string {
  return currency.format(value)
}

export function isLowStock({ stock_actual, stock_minimo }: { stock_actual: number; stock_minimo: number }) {
  return stock_actual <= stock_minimo
}
