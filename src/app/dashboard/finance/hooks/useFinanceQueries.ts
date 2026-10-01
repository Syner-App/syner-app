"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getAssumptionsAction } from "@/app/dashboard/finance/actions/getAssumptionsAction"
import { getBreakEvenAction } from "@/app/dashboard/finance/actions/getBreakEvenAction"
import { getCreditsAction } from "@/app/dashboard/finance/actions/getCreditsAction"
import { getDashboardAction } from "@/app/dashboard/finance/actions/getDashboardAction"
import { getIncomeStatementAction } from "@/app/dashboard/finance/actions/getIncomeStatementAction"
import { getMovementsAction } from "@/app/dashboard/finance/actions/getMovementsAction"
import { getPayablesAction } from "@/app/dashboard/finance/actions/getPayablesAction"
import { getPolicyAction } from "@/app/dashboard/finance/actions/getPolicyAction"
import { getRecipesAction } from "@/app/dashboard/finance/actions/getRecipesAction"
import { getSalesAction } from "@/app/dashboard/finance/actions/getSalesAction"
import { getScenariosAction } from "@/app/dashboard/finance/actions/getScenariosAction"
import { getSuppliesAction } from "@/app/dashboard/finance/actions/getSuppliesAction"
import { getWaterfallAction } from "@/app/dashboard/finance/actions/getWaterfallAction"
import { FINANCE_KEY } from "@/app/dashboard/finance/utils/keys"
import type { MovementFilters, PayableFilters, SaleFilters } from "@/app/dashboard/finance/utils/types"

// Every key starts with FINANCE_KEY so one invalidation refreshes all finance data

export function useFinanceDashboard({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({ queryKey: [...FINANCE_KEY, "dashboard"], queryFn: getDashboardAction, enabled })
}

export function useAssumptions() {
  return useQuery({ queryKey: [...FINANCE_KEY, "assumptions"], queryFn: getAssumptionsAction })
}

export function usePolicy() {
  return useQuery({ queryKey: [...FINANCE_KEY, "policy"], queryFn: getPolicyAction })
}

export function useIncomeStatement(periodo: string) {
  return useQuery({
    queryKey: [...FINANCE_KEY, "income-statement", periodo],
    queryFn: () => getIncomeStatementAction(periodo),
    placeholderData: keepPreviousData,
  })
}

export function useWaterfall() {
  return useQuery({ queryKey: [...FINANCE_KEY, "waterfall"], queryFn: getWaterfallAction })
}

export function useBreakEven() {
  return useQuery({ queryKey: [...FINANCE_KEY, "break-even"], queryFn: getBreakEvenAction, retry: false })
}

export function useScenarios(niveles: number[]) {
  return useQuery({
    queryKey: [...FINANCE_KEY, "scenarios", niveles],
    queryFn: () => getScenariosAction(niveles),
    placeholderData: keepPreviousData,
    retry: false,
  })
}

export function useSupplies() {
  return useQuery({ queryKey: [...FINANCE_KEY, "supplies"], queryFn: getSuppliesAction })
}

export function useRecipes() {
  return useQuery({ queryKey: [...FINANCE_KEY, "recipes"], queryFn: getRecipesAction })
}

// Polls while a sale of the page waits for products-ms to discount its supplies
export function useSales(filters: SaleFilters) {
  return useQuery({
    queryKey: [...FINANCE_KEY, "sales", filters],
    queryFn: () => getSalesAction(filters),
    placeholderData: keepPreviousData,
    refetchInterval: (query) =>
      query.state.data?.data.some((sale) => sale.estado_stock === "STOCK_PENDIENTE") ? 3000 : false,
  })
}

export function usePayables(filters: PayableFilters) {
  return useQuery({
    queryKey: [...FINANCE_KEY, "payables", filters],
    queryFn: () => getPayablesAction(filters),
    placeholderData: keepPreviousData,
  })
}

export function useCredits() {
  return useQuery({ queryKey: [...FINANCE_KEY, "credits"], queryFn: getCreditsAction })
}

export function useMovements(filters: MovementFilters) {
  return useQuery({
    queryKey: [...FINANCE_KEY, "movements", filters],
    queryFn: () => getMovementsAction(filters),
    placeholderData: keepPreviousData,
  })
}
