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

// Active alerts of the organization (sidebar and header badges). Under ALERTS_KEY, so the
// socket events and the stock mutations refresh it
export function useActiveAlertsCount(enabled: boolean) {
  return useQuery({
    queryKey: [...ALERTS_KEY, "active-count"],
    queryFn: () => getAlertsAction({ page: 1, limit: 1, estado: "ACTIVA" }),
    select: (result) => result.meta.total,
    enabled,
  })
}
