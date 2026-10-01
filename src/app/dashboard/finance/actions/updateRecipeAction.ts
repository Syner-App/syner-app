import { apiFetch } from "@/lib/api-client"
import { compact } from "@/app/dashboard/finance/utils/payload"
import type { Recipe } from "@/app/dashboard/finance/utils/types"
import type { RecipeValues } from "@/app/dashboard/finance/validations/recipe"

export function updateRecipeAction({ id, values }: { id: number; values: Partial<RecipeValues> & { activo?: boolean } }) {
  return apiFetch<Recipe>(`/finance/recipes/${id}`, { method: "PATCH", body: compact(values) })
}
