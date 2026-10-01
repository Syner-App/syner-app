"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { addOrganizationMemberAction } from "@/app/dashboard/admin/organizations/actions/addOrganizationMemberAction"
import { getOrganizationMembersAction } from "@/app/dashboard/admin/organizations/actions/getOrganizationMembersAction"
import { removeOrganizationMemberAction } from "@/app/dashboard/admin/organizations/actions/removeOrganizationMemberAction"
import { ORGANIZATIONS_KEY } from "@/app/dashboard/admin/organizations/hooks/useOrganizations"

const membersKey = (id: string) => [...ORGANIZATIONS_KEY, id, "members"]

export function useOrganizationMembers(id?: string) {
  return useQuery({
    queryKey: membersKey(id ?? ""),
    queryFn: () => getOrganizationMembersAction(id!),
    enabled: id !== undefined,
  })
}

export function useAddOrganizationMember(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addOrganizationMemberAction,
    onSuccess: (member) => {
      void queryClient.invalidateQueries({ queryKey: membersKey(id) })
      toast.success(`${member.name} agregado`)
    },
  })
}

export function useRemoveOrganizationMember(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeOrganizationMemberAction,
    onSuccess: (member) => {
      void queryClient.invalidateQueries({ queryKey: membersKey(id) })
      toast.success(`${member.name} ya no es miembro`)
    },
  })
}
