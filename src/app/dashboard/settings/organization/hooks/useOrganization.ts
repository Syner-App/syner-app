"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { SESSION_KEY } from "@/hooks/use-session"
import { getOrganizationAction } from "@/app/dashboard/settings/organization/actions/getOrganizationAction"
import { updateOrganizationAction } from "@/app/dashboard/settings/organization/actions/updateOrganizationAction"

export const ORGANIZATION_KEY = ["organization"]

export function useOrganization() {
  return useQuery({ queryKey: ORGANIZATION_KEY, queryFn: getOrganizationAction })
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateOrganizationAction,
    onSuccess: (organization) => {
      queryClient.setQueryData(ORGANIZATION_KEY, organization)
      // The sidebar shows the name from the memberships
      void queryClient.invalidateQueries({ queryKey: SESSION_KEY })
      toast.success("Organización actualizada")
    },
  })
}
