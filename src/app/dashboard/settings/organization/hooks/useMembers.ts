"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { addMemberAction } from "@/app/dashboard/settings/organization/actions/addMemberAction"
import { getMembersAction } from "@/app/dashboard/settings/organization/actions/getMembersAction"
import { removeMemberAction } from "@/app/dashboard/settings/organization/actions/removeMemberAction"
import { updateMemberRoleAction } from "@/app/dashboard/settings/organization/actions/updateMemberRoleAction"
import { ORGANIZATION_KEY } from "@/app/dashboard/settings/organization/hooks/useOrganization"

export const MEMBERS_KEY = [...ORGANIZATION_KEY, "members"]

export function useMembers() {
  return useQuery({ queryKey: MEMBERS_KEY, queryFn: getMembersAction })
}

function useInvalidateMembers() {
  const queryClient = useQueryClient()
  return () => void queryClient.invalidateQueries({ queryKey: MEMBERS_KEY })
}

export function useAddMember() {
  const invalidate = useInvalidateMembers()
  return useMutation({
    mutationFn: addMemberAction,
    onSuccess: (member) => {
      invalidate()
      toast.success(`${member.name} agregado a la organización`)
    },
  })
}

export function useRemoveMember() {
  const invalidate = useInvalidateMembers()
  return useMutation({
    mutationFn: removeMemberAction,
    onSuccess: (member) => {
      invalidate()
      toast.success(`${member.name} ya no es miembro`)
    },
  })
}

export function useUpdateMemberRole() {
  const invalidate = useInvalidateMembers()
  return useMutation({
    mutationFn: updateMemberRoleAction,
    onSuccess: (user) => {
      invalidate()
      toast.success(`Rol de ${user.name} actualizado`)
    },
  })
}
