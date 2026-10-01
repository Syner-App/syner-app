import { apiFetch } from "@/lib/api-client"
import { compact } from "@/app/dashboard/finance/utils/payload"
import type { Recipe } from "@/app/dashboard/finance/utils/types"
import type { RecipeValues } from "@/app/dashboard/finance/validations/recipe"

export function createRecipeAction(values: RecipeValues) {
  return apiFetch<Recipe>("/finance/recipes", { method: "POST", body: compact(values) })
}
