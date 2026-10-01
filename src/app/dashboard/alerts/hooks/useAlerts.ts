"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getAlertsAction } from "@/app/dashboard/alerts/actions/getAlertsAction"
import type { AlertFilters } from "@/app/dashboard/alerts/utils/types"

export const ALERTS_KEY = ["alerts"]

export function useAlerts(filters: AlertFilters) {
  return useQuery({
    queryKey: [...ALERTS_KEY, filters],
    queryFn: () => getAlertsAction(filters),
    placeholderData: keepPreviousData,
  })
}
