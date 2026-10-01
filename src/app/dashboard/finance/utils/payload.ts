// Form values -> request body: optional fields left empty ("" or a NaN number input) are
// dropped so the backend applies its default (today, the recipe price, the computed cost…)
export function compact<T extends object>(values: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== "" && !Number.isNaN(value) && value !== undefined)
  ) as Partial<T>
}
