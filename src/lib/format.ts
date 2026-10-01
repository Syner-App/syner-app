// Formatting shared by every feature. Amounts are whole Colombian pesos, like the backend

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
})

const number = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 4 })

const percent = new Intl.NumberFormat("es-CO", { style: "percent", maximumFractionDigits: 1 })

const date = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" })

const month = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" })

export function formatMoney(value: number): string {
  return currency.format(value)
}

// Compact amounts for chart axes: $1,2 M
export function formatMoneyShort(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatNumber(value: number): string {
  return number.format(value)
}

// 0.25 -> 25 %
export function formatPercent(ratio: number): string {
  return percent.format(ratio)
}

// Accepts an ISO timestamp or a YYYY-MM-DD date (read as a local date, not UTC midnight)
export function formatDate(value: string): string {
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : date.format(parsed)
}

// YYYY-MM -> "Septiembre de 2026"
export function formatPeriod(period: string): string {
  const parsed = new Date(`${period}-01T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return period
  const text = month.format(parsed)
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function pad(value: number): string {
  return String(value).padStart(2, "0")
}

// Today as YYYY-MM-DD in the local time zone
export function today(): string {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

// The current period as YYYY-MM
export function currentPeriod(): string {
  return today().slice(0, 7)
}

// The last `count` periods, newest first, for period pickers
export function recentPeriods(count = 12): string[] {
  const now = new Date()
  return Array.from({ length: count }, (_, index) => {
    const value = new Date(now.getFullYear(), now.getMonth() - index, 1)
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}`
  })
}
