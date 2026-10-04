import { useSyncExternalStore } from "react"

// A low stock alert makes orders-ms open a purchase order, but the socket event reaches the
// browser before the order exists and its validation takes well under a second. This tracks
// that window on the client so the UI can show the order is being generated

// Keeps the spinner visible long enough to be noticed
export const MIN_VISIBLE_MS = 1_500
// orders-ms creates nothing when the product already has an open order
export const MAX_WAIT_MS = 10_000

export interface OrderGeneration {
  startedAt: number
  // Latest purchase order when the alert arrived: a different one is the generated order
  baselineId: string | undefined
}

let generation: OrderGeneration | null = null
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function markOrderGenerating(baselineId: string | undefined) {
  generation = { startedAt: Date.now(), baselineId }
  emit()
}

export function clearOrderGenerating() {
  if (!generation) return
  generation = null
  emit()
}

export function isOrderGenerating() {
  return generation !== null
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useOrderGeneration() {
  return useSyncExternalStore(
    subscribe,
    () => generation,
    () => null
  )
}
