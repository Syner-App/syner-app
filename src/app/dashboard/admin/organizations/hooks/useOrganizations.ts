"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createOrganizationAction } from "@/app/dashboard/admin/organizations/actions/createOrganizationAction"
import { getOrganizationsAction } from "@/app/dashboard/admin/organizations/actions/getOrganizationsAction"
import { updateOrganizationStatusAction } from "@/app/dashboard/admin/organizations/actions/updateOrganizationStatusAction"

export const ORGANIZATIONS_KEY = ["admin", "organizations"]

export function useOrganizations() {
  return useQuery({ queryKey: ORGANIZATIONS_KEY, queryFn: getOrganizationsAction })
}

export function useCreateOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOrganizationAction,
    onSuccess: (organization) => {
      void queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_KEY })
      toast.success(`Organización ${organization.name} creada`)
    },
  })
}

export function useUpdateOrganizationStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateOrganizationStatusAction,
    onSuccess: (organization) => {
      void queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_KEY })
      toast.success(
        `${organization.name} ${organization.status === "ACTIVE" ? "reactivada" : "suspendida"}`
      )
    },
  })
}
