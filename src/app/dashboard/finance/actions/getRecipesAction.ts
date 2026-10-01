import { apiFetch } from "@/lib/api-client"
import type { List } from "@/lib/types"
import type { Recipe } from "@/app/dashboard/finance/utils/types"

export function getRecipesAction() {
  return apiFetch<List<Recipe>>("/finance/recipes")
}
