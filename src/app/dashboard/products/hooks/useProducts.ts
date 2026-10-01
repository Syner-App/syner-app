"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getProductsAction } from "@/app/dashboard/products/actions/getProductsAction"
import type { ProductFilters } from "@/app/dashboard/products/utils/types"

export const PRODUCTS_KEY = ["products"]

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, filters],
    queryFn: () => getProductsAction(filters),
    placeholderData: keepPreviousData,
  })
}
